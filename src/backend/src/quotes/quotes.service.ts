import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import {
  QUOTE_ALLOWED_STAGE_NAMES,
  QUOTE_STATUS,
} from './constants/quote.constant';
import type {
  CreateQuoteDto,
  CreateQuoteItemDto,
} from './dto/create-quote.dto';
import type { UpdateQuoteDto } from './dto/update-quote.dto';
import {
  type QuoteDetailCreateData,
  type QuoteWithRelations,
  QuotesRepository,
} from './repositories/quotes.repository';

type QuoteProduct = Awaited<
  ReturnType<QuotesRepository['findProductsByIds']>
>[number];

@Injectable()
export class QuotesService {
  constructor(private readonly quotesRepository: QuotesRepository) {}

  /**
   * Lấy danh sách Quote thuộc các Deal mà Sales hiện tại phụ trách.
   */
  async findAll(user: AuthenticatedUser) {
    const quotes = await this.quotesRepository.findOwnedQuotes(user.userId);
    return quotes.map((quote) => this.mapQuote(quote));
  }

  /**
   * Xem chi tiết Quote thuộc quyền Sales.
   */
  async findOne(quoteId: number, user: AuthenticatedUser) {
    const quote = await this.requireOwnedQuote(quoteId, user.userId);
    return this.mapQuote(quote);
  }

  /**
   * Lấy danh sách Deal và Product hợp lệ để Sales tạo hoặc chỉnh sửa Quote.
   */
  async getMeta(user: AuthenticatedUser) {
    const [deals, products] = await Promise.all([
      this.quotesRepository.findOwnedDealsForMeta(user.userId),
      this.quotesRepository.findProductsForMeta(),
    ]);

    // BR-21: Chỉ Deal đang ở giai đoạn Proposal hoặc Negotiation mới được phép tạo báo giá.
    const eligibleDeals = deals.filter((deal) => {
      const stageName = deal.pipelinestages.stagename.trim().toLowerCase();

      return stageName === 'proposal' || stageName === 'negotiation';
    });

    // BR-17: Chỉ Product đang hoạt động và có giá bán lớn hơn 0 mới được phép đưa vào Quote.
    const eligibleProducts = products.filter(
      (product) =>
        product.status === true &&
        product.price !== null &&
        new Prisma.Decimal(product.price).greaterThan(0),
    );

    return {
      deals: eligibleDeals.map((deal) => ({
        dealId: deal.dealid,
        dealCode: `DL${String(deal.dealid).padStart(3, '0')}`,
        dealName: deal.dealname,
        stageName: deal.pipelinestages.stagename,

        customer: {
          customerId: deal.customers.customerid,
          fullName: deal.customers.fullname,
          company: deal.customers.company,
        },
      })),

      products: eligibleProducts.map((product) => ({
        productId: product.productid,
        productName: product.productname,
        category: product.category,
        price: Number(product.price),
      })),
    };
  }

  /**
   * Tạo Quote mới cho Deal.
   */
  async create(
    dto: CreateQuoteDto,
    user: AuthenticatedUser,
    ipAddress?: string,
  ) {
    this.ensureNoDuplicateProducts(dto.items);
    const deal = await this.requireOwnedDeal(dto.dealId, user.userId);
    this.ensureQuoteStage(deal.pipelinestages.stagename);
    const quoteItems = await this.prepareQuoteItems(dto.items);
    const totalAmount = this.calculateTotalAmount(quoteItems);

    // BR-18: Mọi thao tác tạo Quote phải được ghi nhận vào Activity Log.
    const quote = await this.quotesRepository.createWithDetailsAndLog({
      dealId: deal.dealid,
      userId: user.userId,
      totalAmount,
      status: QUOTE_STATUS.Draft,
      items: quoteItems,
      ipAddress,
    });

    return {
      message: 'Tạo báo giá thành công.',
      data: this.mapQuote(quote),
    };
  }

  /**
   * Cập nhật danh sách sản phẩm của Quote.
   */
  async update(
    quoteId: number,
    dto: UpdateQuoteDto,
    user: AuthenticatedUser,
    ipAddress?: string,
  ) {
    const currentQuote = await this.requireOwnedQuote(quoteId, user.userId);

    // BR-22: Chỉ Quote đang ở trạng thái Draft mới được phép chỉnh sửa nội dung báo giá.
    this.ensureDraftQuote(currentQuote);

    this.ensureNoDuplicateProducts(dto.items);

    const quoteItems = await this.prepareQuoteItems(dto.items);
    const totalAmount = this.calculateTotalAmount(quoteItems);

    // BR-12: Khi sản phẩm hoặc số lượng trong Quote thay đổi, hệ thống phải tính lại từng QuoteDetail và tổng giá trị Quote.
    // BR-18: Việc cập nhật Quote phải được ghi lại trong Activity Log.
    const updatedQuote = await this.quotesRepository.updateWithDetailsAndLog({
      quoteId,
      userId: user.userId,
      totalAmount,
      items: quoteItems,
      currentQuote,
      ipAddress,
    });

    return {
      message: 'Cập nhật báo giá thành công.',
      data: this.mapQuote(updatedQuote),
    };
  }

  /**
   * Xác nhận Quote đang ở trạng thái Draft.
   */
  async confirm(quoteId: number, user: AuthenticatedUser, ipAddress?: string) {
    const currentQuote = await this.requireOwnedQuote(quoteId, user.userId);

    // BR-23: Chỉ Quote Draft mới được xác nhận.
    this.ensureDraftQuote(currentQuote);

    // BR-18: Thao tác xác nhận Quote phải được ghi nhận trong Activity Log.
    const updatedQuote = await this.quotesRepository.changeStatusWithLog({
      quoteId,
      userId: user.userId,
      newStatus: QUOTE_STATUS.Confirmed,
      currentQuote,
      ipAddress,
    });

    return {
      message: 'Xác nhận báo giá thành công.',
      data: this.mapQuote(updatedQuote),
    };
  }

  /**
   * Hủy Quote đang ở trạng thái Draft.
   */
  async cancel(quoteId: number, user: AuthenticatedUser, ipAddress?: string) {
    const currentQuote = await this.requireOwnedQuote(quoteId, user.userId);

    // BR-23: Quote đã Confirmed không được phép hủy hoặc thay đổi trở lại trạng thái trước đó.
    // BR-24: Quote không được xóa vật lý. Nếu Quote Draft không còn sử dụng, hệ thống chỉ chuyển trạng thái của Quote sang Cancelled.
    this.ensureDraftQuote(currentQuote);

    // BR-18: Thao tác hủy Quote phải được ghi nhận trong Activity Log.
    const updatedQuote = await this.quotesRepository.changeStatusWithLog({
      quoteId,
      userId: user.userId,
      newStatus: QUOTE_STATUS.Cancelled,
      currentQuote,
      ipAddress,
    });

    return {
      message: 'Hủy báo giá thành công.',
      data: this.mapQuote(updatedQuote),
    };
  }

  private async requireOwnedDeal(dealId: number, salesUserId: number) {
    const deal = await this.quotesRepository.findOwnedDeal(dealId, salesUserId);

    // BR-11: Quote chỉ được tạo cho Deal đã tồn tại, có Customer hợp lệ và Deal phải thuộc quyền quản lý của Sales đang đăng nhập.
    if (!deal || !deal.customers) {
      throw new UnprocessableEntityException(
        'Deal không tồn tại, không có Customer hợp lệ hoặc bạn không có quyền tạo báo giá cho Deal này.',
      );
    }

    return deal;
  }

  private async requireOwnedQuote(
    quoteId: number,
    salesUserId: number,
  ): Promise<QuoteWithRelations> {
    const quote = await this.quotesRepository.findOwnedQuoteById(
      quoteId,
      salesUserId,
    );

    if (!quote) {
      throw new NotFoundException('Không tìm thấy báo giá.');
    }

    return quote;
  }

  private ensureQuoteStage(stageName: string): void {
    const normalizedStage = stageName.trim().toLowerCase();

    // BR-21: Chỉ Deal đang ở giai đoạn Proposal hoặc Negotiation mới được phép tạo Quote.
    if (
      !QUOTE_ALLOWED_STAGE_NAMES.includes(
        normalizedStage as (typeof QUOTE_ALLOWED_STAGE_NAMES)[number],
      )
    ) {
      throw new UnprocessableEntityException(
        'Chỉ có thể tạo báo giá khi Deal đang ở giai đoạn Đề xuất báo giá hoặc Đàm phán.',
      );
    }
  }

  private ensureDraftQuote(quote: QuoteWithRelations): void {
    // BR-22: Chỉ Quote có trạng thái Draft mới được chỉnh sửa.
    // BR-23: Quote đã Confirmed hoặc Cancelled là trạng thái khóa, không được chỉnh sửa, xác nhận lại hoặc hủy lại.
    if (quote.status !== QUOTE_STATUS.Draft) {
      throw new UnprocessableEntityException(
        'Chỉ báo giá ở trạng thái Bản nháp mới được thực hiện thao tác này.',
      );
    }
  }

  private async prepareQuoteItems(
    items: CreateQuoteItemDto[],
  ): Promise<QuoteDetailCreateData[]> {
    const products = await this.requireProducts(items);

    return this.buildQuoteItems(items, products);
  }

  private async requireProducts(
    items: CreateQuoteItemDto[],
  ): Promise<QuoteProduct[]> {
    const productIds = items.map((item) => item.productId);

    const products = await this.quotesRepository.findProductsByIds(productIds);

    if (products.length !== productIds.length) {
      throw new UnprocessableEntityException('Có sản phẩm không tồn tại.');
    }

    // BR-17: Sản phẩm đưa vào Quote phải đang hoạt động và giá bán của sản phẩm phải lớn hơn 0.
    const invalidProduct = products.find(
      (product) =>
        product.status !== true ||
        product.price === null ||
        new Prisma.Decimal(product.price).lessThanOrEqualTo(0),
    );

    if (invalidProduct) {
      throw new UnprocessableEntityException(
        `Sản phẩm "${invalidProduct.productname}" đã ngừng hoạt động hoặc có giá không hợp lệ.`,
      );
    }

    return products;
  }

  private buildQuoteItems(
    items: CreateQuoteItemDto[],
    products: QuoteProduct[],
  ): QuoteDetailCreateData[] {
    return items.map((item) => {
      // BR-12: Số lượng từng sản phẩm trong Quote phải lớn hơn 0.
      if (item.quantity <= 0) {
        throw new UnprocessableEntityException(
          'Số lượng sản phẩm phải lớn hơn 0.',
        );
      }

      const product = products.find(
        (currentProduct) => currentProduct.productid === item.productId,
      );

      if (!product || product.price === null) {
        throw new UnprocessableEntityException('Sản phẩm không hợp lệ.');
      }

      // BR-12: Đơn giá phải được lấy trực tiếp từ Product trong database.
      const unitPrice = new Prisma.Decimal(product.price);

      // BR-12: Thành tiền của mỗi QuoteDetail được hệ thống tính bằng: UnitPrice × Quantity.
      const total = unitPrice.mul(item.quantity);

      return {
        productId: product.productid,
        quantity: item.quantity,
        unitPrice,
        total,
      };
    });
  }

  private calculateTotalAmount(items: QuoteDetailCreateData[]): Prisma.Decimal {
    // BR-12: Tổng giá trị Quote phải được tính từ tổng giá trị của tất cả QuoteDetail,
    return items.reduce(
      (total, item) => total.add(item.total),
      new Prisma.Decimal(0),
    );
  }

  private ensureNoDuplicateProducts(items: CreateQuoteItemDto[]): void {
    const productIds = items.map((item) => item.productId);
    if (new Set(productIds).size !== productIds.length) {
      throw new BadRequestException(
        'Mỗi sản phẩm chỉ được thêm một lần trong báo giá.',
      );
    }
  }

  private mapQuote(quote: QuoteWithRelations) {
    return {
      quoteId: quote.quoteid,
      quoteCode: `QT${String(quote.quoteid).padStart(3, '0')}`,
      quoteDate: quote.quotedate,
      totalAmount: quote.totalamount === null ? 0 : Number(quote.totalamount),
      status: quote.status,
      deal: {
        dealId: quote.deals.dealid,
        dealName: quote.deals.dealname,
        stageName: quote.deals.pipelinestages.stagename,
      },

      customer: {
        customerId: quote.deals.customers.customerid,
        fullName: quote.deals.customers.fullname,
        company: quote.deals.customers.company,
      },

      createdBy: quote.users
        ? {
            userId: quote.users.userid,
            fullName: quote.users.fullname,
          }
        : null,

      items: quote.quotedetails.map((detail) => ({
        quoteDetailId: detail.quotedetailid,
        productId: detail.productid,
        productName: detail.products.productname,
        quantity: detail.quantity,
        unitPrice: detail.unitprice === null ? 0 : Number(detail.unitprice),
        discount: detail.discount === null ? 0 : Number(detail.discount),
        total: detail.total === null ? 0 : Number(detail.total),
      })),
    };
  }
}
