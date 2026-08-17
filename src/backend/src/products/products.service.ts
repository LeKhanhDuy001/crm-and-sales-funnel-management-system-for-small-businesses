import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  type CreateProductData,
  type UpdateProductData,
  ProductsRepository,
} from './repositories/products.repository';

interface ProductRecord {
  productid: number;
  productname: string;
  category: string | null;
  price: unknown;
  description: string | null;
  status: boolean | null;
}

function normalizeOptionalText(value?: string): string | null {
  const normalized = value?.trim();

  return normalized ? normalized : null;
}

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  /**
   * Lấy danh sách sản phẩm theo bộ lọc và phân trang.
   */
  async findAll(query: ProductQueryDto) {
    const { page = 1, limit = 20 } = query;

    const filter = {
      search: query.search?.trim() || undefined,
      category: query.category?.trim() || undefined,
      status: query.status,
    };

    const [products, total] = await Promise.all([
      this.productsRepository.findMany({
        ...filter,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.productsRepository.count(filter),
    ]);

    return {
      data: products.map((product) => this.mapProduct(product)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Lấy các danh mục sản phẩm hiện có.
   */
  async findCategories() {
    const categories = await this.productsRepository.findCategories();

    return { data: categories };
  }

  /**
   * Lấy chi tiết một sản phẩm.
   */
  async findOne(productId: number) {
    const product = await this.requireProduct(productId);
    return this.mapProduct(product);
  }

  /**
   * Tạo sản phẩm mới và ghi Activity Log.
   */
  async create(dto: CreateProductDto, currentUser: AuthenticatedUser) {
    const productName = dto.productName.trim();

    await this.ensureUniqueName(productName);

    // BR-17: giá sản phẩm phải lớn hơn 0.
    this.validatePrice(dto.price);

    const data: CreateProductData = {
      productname: productName,
      category: normalizeOptionalText(dto.category),
      price: dto.price,
      description: normalizeOptionalText(dto.description),
      status: dto.status ?? true,
    };

    const product = await this.productsRepository.create(
      data,
      currentUser.userId,
    );

    return {
      message: 'Thêm sản phẩm thành công.',
      product: this.mapProduct(product),
    };
  }

  /**
   * Cập nhật thông tin sản phẩm.
   */
  async update(
    productId: number,
    dto: UpdateProductDto,
    currentUser: AuthenticatedUser,
  ) {
    const current = await this.requireProduct(productId);

    const data = await this.prepareUpdateData(productId, dto);

    if (Object.keys(data).length === 0) {
      return {
        message: 'Không có thông tin cần cập nhật.',
        product: this.mapProduct(current),
      };
    }

    const product = await this.productsRepository.update(
      productId,
      data,
      currentUser.userId,
      current,
    );

    return {
      message: 'Cập nhật sản phẩm thành công.',
      product: this.mapProduct(product),
    };
  }

  /**
   * Xóa sản phẩm hoặc ngừng hoạt động nếu đã phát sinh QuoteDetail.
   */
  async remove(productId: number, currentUser: AuthenticatedUser) {
    const current = await this.requireProduct(productId);

    const quoteDetailCount =
      await this.productsRepository.countQuoteDetails(productId);

    // BR-17, BR-20: đã nằm trong báo giá thì không xóa vật lý.
    if (quoteDetailCount > 0) {
      const product = await this.productsRepository.deactivate(
        productId,
        currentUser.userId,
        current,
      );

      return {
        message:
          'Sản phẩm đã phát sinh báo giá nên được chuyển sang ngừng hoạt động.',
        mode: 'deactivated',
        product: this.mapProduct(product),
      };
    }

    await this.productsRepository.delete(
      productId,
      currentUser.userId,
      current,
    );

    return {
      message: 'Xóa sản phẩm thành công.',
      mode: 'deleted',
      productId,
    };
  }

  private async requireProduct(productId: number) {
    const product = await this.productsRepository.findById(productId);

    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm.');
    }

    return product;
  }

  private async ensureUniqueName(
    productName: string,
    productId?: number,
  ): Promise<void> {
    const duplicate =
      productId === undefined
        ? await this.productsRepository.findByName(productName)
        : await this.productsRepository.findByNameExceptId(
            productName,
            productId,
          );

    if (duplicate) {
      throw new ConflictException('Tên sản phẩm đã tồn tại.');
    }
  }

  private validatePrice(price: number): void {
    // BR-17: giá sản phẩm phải lớn hơn 0.
    if (!Number.isFinite(price) || price <= 0) {
      throw new UnprocessableEntityException('Giá sản phẩm phải lớn hơn 0.');
    }
  }

  private async prepareUpdateData(
    productId: number,
    dto: UpdateProductDto,
  ): Promise<UpdateProductData> {
    const data: UpdateProductData = {};

    if (dto.productName !== undefined) {
      const name = dto.productName.trim();

      if (!name) {
        throw new UnprocessableEntityException(
          'Tên sản phẩm không được để trống.',
        );
      }

      await this.ensureUniqueName(name, productId);
      data.productname = name;
    }

    if (dto.category !== undefined) {
      data.category = normalizeOptionalText(dto.category);
    }

    if (dto.price !== undefined) {
      this.validatePrice(dto.price);
      data.price = dto.price;
    }

    if (dto.description !== undefined) {
      data.description = normalizeOptionalText(dto.description);
    }

    if (dto.status !== undefined) {
      data.status = dto.status;
    }

    return data;
  }

  private mapProduct(product: ProductRecord) {
    return {
      productId: product.productid,
      productCode: `SP${String(product.productid).padStart(3, '0')}`,
      productName: product.productname,
      category: product.category,
      price: product.price === null ? null : Number(product.price),
      description: product.description,
      status: product.status ?? true,
    };
  }
}
