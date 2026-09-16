import {
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { Role } from '../common/enums/role.enum';
import { QUOTE_STATUS } from './constants/quote.constant';
import {
  QuotesRepository,
  type QuoteWithRelations,
} from './repositories/quotes.repository';
import { QuotesService } from './quotes.service';

type QuotesRepositoryMock = {
  findOwnedDeal: jest.MockedFunction<QuotesRepository['findOwnedDeal']>;
  findProductsByIds: jest.MockedFunction<QuotesRepository['findProductsByIds']>;
  findOwnedQuotes: jest.MockedFunction<QuotesRepository['findOwnedQuotes']>;
  findOwnedQuoteById: jest.MockedFunction<
    QuotesRepository['findOwnedQuoteById']
  >;
  createWithDetailsAndLog: jest.MockedFunction<
    QuotesRepository['createWithDetailsAndLog']
  >;
  updateWithDetailsAndLog: jest.MockedFunction<
    QuotesRepository['updateWithDetailsAndLog']
  >;
  changeStatusWithLog: jest.MockedFunction<
    QuotesRepository['changeStatusWithLog']
  >;
  findOwnedDealsForMeta: jest.MockedFunction<
    QuotesRepository['findOwnedDealsForMeta']
  >;
  findProductsForMeta: jest.MockedFunction<
    QuotesRepository['findProductsForMeta']
  >;
};

describe('QuotesService - Sales tạo báo giá', () => {
  let quotesService: QuotesService;
  let quotesRepository: QuotesRepositoryMock;
  const salesUser = {
    userId: 5,
    fullName: 'Nguyễn Văn Sales',
    email: 'sales@crm.com',
    role: Role.SALES,
  } as AuthenticatedUser;
  const ownedDeal = {
    dealid: 7,
    dealname: 'Triển khai CRM',
    customerid: 3,
    assigneduserid: 5,
    customers: {
      customerid: 3,
      fullname: 'Công ty ABC',
    },
    pipelinestages: {
      stageid: 3,
      stagename: 'Proposal',
    },
  };
  const productOne = {
    productid: 1,
    productname: 'Gói CRM Basic',
    price: new Prisma.Decimal(100_000),
    status: true,
  };
  const productTwo = {
    productid: 2,
    productname: 'Gói CRM Premium',
    price: new Prisma.Decimal(250_000),
    status: true,
  };
  const createdQuote = {
    quoteid: 11,
    dealid: 7,
    quotedate: new Date('2026-08-22T08:00:00.000Z'),
    totalamount: new Prisma.Decimal(950_000),
    status: QUOTE_STATUS.Draft,
    createdby: 5,
    deals: {
      dealid: 7,
      dealname: 'Triển khai CRM',
      assigneduserid: 5,

      customers: {
        customerid: 3,
        fullname: 'Công ty ABC',
        company: 'ABC',
      },

      pipelinestages: {
        stageid: 3,
        stagename: 'Proposal',
        stageorder: 3,
      },
    },

    users: {
      userid: 5,
      fullname: 'Nguyễn Văn Sales',
    },

    quotedetails: [
      {
        quotedetailid: 101,
        productid: 1,
        quantity: 2,
        unitprice: new Prisma.Decimal(100_000),
        discount: new Prisma.Decimal(0),
        total: new Prisma.Decimal(200_000),

        products: {
          productid: 1,
          productname: 'Gói CRM Basic',
        },
      },
      {
        quotedetailid: 102,
        productid: 2,
        quantity: 3,
        unitprice: new Prisma.Decimal(250_000),
        discount: new Prisma.Decimal(0),
        total: new Prisma.Decimal(750_000),

        products: {
          productid: 2,
          productname: 'Gói CRM Premium',
        },
      },
    ],
  } as QuoteWithRelations;

  beforeEach(() => {
    quotesRepository = {
      findOwnedDeal: jest.fn() as jest.MockedFunction<
        QuotesRepository['findOwnedDeal']
      >,
      findProductsByIds: jest.fn() as jest.MockedFunction<
        QuotesRepository['findProductsByIds']
      >,
      findOwnedQuotes: jest.fn() as jest.MockedFunction<
        QuotesRepository['findOwnedQuotes']
      >,
      findOwnedQuoteById: jest.fn() as jest.MockedFunction<
        QuotesRepository['findOwnedQuoteById']
      >,
      createWithDetailsAndLog: jest.fn() as jest.MockedFunction<
        QuotesRepository['createWithDetailsAndLog']
      >,
      updateWithDetailsAndLog: jest.fn() as jest.MockedFunction<
        QuotesRepository['updateWithDetailsAndLog']
      >,
      changeStatusWithLog: jest.fn() as jest.MockedFunction<
        QuotesRepository['changeStatusWithLog']
      >,
      findOwnedDealsForMeta: jest.fn() as jest.MockedFunction<
        QuotesRepository['findOwnedDealsForMeta']
      >,
      findProductsForMeta: jest.fn() as jest.MockedFunction<
        QuotesRepository['findProductsForMeta']
      >,
    };

    quotesService = new QuotesService(
      quotesRepository as unknown as QuotesRepository,
    );
  });

  describe('getMeta', () => {
    it('chỉ trả Deal và Product hợp lệ để Sales tạo báo giá', async () => {
      quotesRepository.findOwnedDealsForMeta.mockResolvedValue([
        {
          dealid: 7,
          dealname: 'Deal Proposal',
          customers: {
            customerid: 3,
            fullname: 'Công ty ABC',
            company: 'ABC',
          },
          pipelinestages: {
            stageid: 3,
            stagename: 'Proposal',
          },
        },
        {
          dealid: 8,
          dealname: 'Deal Negotiation',
          customers: {
            customerid: 4,
            fullname: 'Công ty XYZ',
            company: 'XYZ',
          },
          pipelinestages: {
            stageid: 4,
            stagename: 'Negotiation',
          },
        },
        {
          dealid: 9,
          dealname: 'Deal Qualified',
          customers: {
            customerid: 5,
            fullname: 'Công ty DEF',
            company: 'DEF',
          },
          pipelinestages: {
            stageid: 2,
            stagename: 'Qualified',
          },
        },
      ]);

      quotesRepository.findProductsForMeta.mockResolvedValue([
        {
          productid: 1,
          productname: 'Sản phẩm hợp lệ',
          category: 'CRM',
          price: new Prisma.Decimal(100_000),
          status: true,
        },
        {
          productid: 2,
          productname: 'Sản phẩm ngừng hoạt động',
          category: 'CRM',
          price: new Prisma.Decimal(200_000),
          status: false,
        },
        {
          productid: 3,
          productname: 'Sản phẩm giá 0',
          category: 'CRM',
          price: new Prisma.Decimal(0),
          status: true,
        },
      ]);
      const result = await quotesService.getMeta(salesUser);
      expect(quotesRepository.findOwnedDealsForMeta).toHaveBeenCalledWith(5);
      expect(result.deals).toHaveLength(2);
      expect(result.deals.map((deal) => deal.dealId)).toEqual([7, 8]);
      expect(result.products).toEqual([
        {
          productId: 1,
          productName: 'Sản phẩm hợp lệ',
          category: 'CRM',
          price: 100_000,
        },
      ]);
    });
  });

  describe('create', () => {
    it('BR-11, BR-12, BR-17, BR-18, BR-21 - tạo báo giá hợp lệ và tính đúng tổng tiền', async () => {
      quotesRepository.findOwnedDeal.mockResolvedValue(ownedDeal);
      quotesRepository.findProductsByIds.mockResolvedValue([
        productOne,
        productTwo,
      ]);
      quotesRepository.createWithDetailsAndLog.mockResolvedValue(createdQuote);
      const dto = {
        dealId: 7,
        items: [
          {
            productId: 1,
            quantity: 2,
          },
          {
            productId: 2,
            quantity: 3,
          },
        ],
      };

      const result = await quotesService.create(dto, salesUser, '192.168.1.10');
      expect(quotesRepository.findOwnedDeal).toHaveBeenCalledWith(7, 5);
      expect(quotesRepository.findProductsByIds).toHaveBeenCalledWith([1, 2]);
      const createInput =
        quotesRepository.createWithDetailsAndLog.mock.calls[0]?.[0];
      expect(createInput).toBeDefined();
      expect(createInput?.dealId).toBe(7);
      expect(createInput?.userId).toBe(5);
      expect(createInput?.status).toBe(QUOTE_STATUS.Draft);
      expect(createInput?.ipAddress).toBe('192.168.1.10');
      expect(createInput?.items[0]?.unitPrice.toNumber()).toBe(100_000);
      expect(createInput?.items[0]?.total.toNumber()).toBe(200_000);
      expect(createInput?.items[1]?.unitPrice.toNumber()).toBe(250_000);
      expect(createInput?.items[1]?.total.toNumber()).toBe(750_000);
      expect(createInput?.totalAmount.toNumber()).toBe(950_000);
      expect(result.message).toBe('Tạo báo giá thành công.');
      expect(result.data).toMatchObject({
        quoteId: 11,
        quoteCode: 'QT011',
        totalAmount: 950_000,
        status: QUOTE_STATUS.Draft,
      });
      expect(result.data.items).toHaveLength(2);
    });

    it('không cho thêm cùng một Product nhiều lần trong Quote', async () => {
      const dto = {
        dealId: 7,
        items: [
          {
            productId: 1,
            quantity: 1,
          },
          {
            productId: 1,
            quantity: 2,
          },
        ],
      };

      await expect(quotesService.create(dto, salesUser)).rejects.toThrow(
        new BadRequestException(
          'Mỗi sản phẩm chỉ được thêm một lần trong báo giá.',
        ),
      );
      expect(quotesRepository.findOwnedDeal).not.toHaveBeenCalled();
      expect(quotesRepository.createWithDetailsAndLog).not.toHaveBeenCalled();
    });

    it('BR-11 - từ chối khi Deal không tồn tại hoặc không thuộc quyền Sales', async () => {
      quotesRepository.findOwnedDeal.mockResolvedValue(null);
      await expect(
        quotesService.create(
          {
            dealId: 999,
            items: [
              {
                productId: 1,
                quantity: 1,
              },
            ],
          },
          salesUser,
        ),
      ).rejects.toThrow(
        new UnprocessableEntityException(
          'Deal không tồn tại, không có Customer hợp lệ hoặc bạn không có quyền tạo báo giá cho Deal này.',
        ),
      );

      expect(quotesRepository.findProductsByIds).not.toHaveBeenCalled();
      expect(quotesRepository.createWithDetailsAndLog).not.toHaveBeenCalled();
    });

    it('BR-11 - từ chối tạo Quote khi Deal không có Customer hợp lệ', async () => {
      quotesRepository.findOwnedDeal.mockResolvedValue({
        dealid: 7,
        dealname: 'Deal không có Customer',
        customerid: null,
        assigneduserid: salesUser.userId,
        customers: null,
        pipelinestages: {
          stageid: 4,
          stagename: 'Proposal',
        },
      } as never);

      await expect(
        quotesService.create(
          {
            dealId: 7,
            items: [
              {
                productId: 1,
                quantity: 1,
              },
            ],
          },
          salesUser,
          '127.0.0.1',
        ),
      ).rejects.toThrow(
        'Deal không tồn tại, không có Customer hợp lệ hoặc bạn không có quyền tạo báo giá cho Deal này.',
      );

      expect(quotesRepository.findProductsByIds).not.toHaveBeenCalled();
      expect(quotesRepository.createWithDetailsAndLog).not.toHaveBeenCalled();
    });

    it('BR-21 - từ chối tạo Quote khi Deal không ở Proposal hoặc Negotiation', async () => {
      quotesRepository.findOwnedDeal.mockResolvedValue({
        ...ownedDeal,
        pipelinestages: {
          stageid: 2,
          stagename: 'Qualified',
        },
      });
      await expect(
        quotesService.create(
          {
            dealId: 7,
            items: [
              {
                productId: 1,
                quantity: 1,
              },
            ],
          },
          salesUser,
        ),
      ).rejects.toThrow(
        new UnprocessableEntityException(
          'Chỉ có thể tạo báo giá khi Deal đang ở giai đoạn Đề xuất báo giá hoặc Đàm phán.',
        ),
      );
      expect(quotesRepository.findProductsByIds).not.toHaveBeenCalled();

      expect(quotesRepository.createWithDetailsAndLog).not.toHaveBeenCalled();
    });
    it('BR-17 - từ chối khi có Product không tồn tại', async () => {
      quotesRepository.findOwnedDeal.mockResolvedValue(ownedDeal);
      quotesRepository.findProductsByIds.mockResolvedValue([productOne]);
      await expect(
        quotesService.create(
          {
            dealId: 7,
            items: [
              {
                productId: 1,
                quantity: 1,
              },
              {
                productId: 999,
                quantity: 1,
              },
            ],
          },
          salesUser,
        ),
      ).rejects.toThrow(
        new UnprocessableEntityException('Có sản phẩm không tồn tại.'),
      );
      expect(quotesRepository.createWithDetailsAndLog).not.toHaveBeenCalled();
    });

    it.each([
      [
        'đã ngừng hoạt động',
        {
          productid: 1,
          productname: 'Sản phẩm lỗi',
          price: new Prisma.Decimal(100_000),
          status: false,
        },
      ],
      [
        'không có giá',
        {
          productid: 1,
          productname: 'Sản phẩm lỗi',
          price: null,
          status: true,
        },
      ],
      [
        'có giá bằng 0',
        {
          productid: 1,
          productname: 'Sản phẩm lỗi',
          price: new Prisma.Decimal(0),
          status: true,
        },
      ],
      [
        'có giá âm',
        {
          productid: 1,
          productname: 'Sản phẩm lỗi',
          price: new Prisma.Decimal(-100),
          status: true,
        },
      ],
    ])('BR-17 - từ chối Product %s', async (_caseName, invalidProduct) => {
      quotesRepository.findOwnedDeal.mockResolvedValue(ownedDeal);
      quotesRepository.findProductsByIds.mockResolvedValue([invalidProduct]);
      await expect(
        quotesService.create(
          {
            dealId: 7,
            items: [
              {
                productId: 1,
                quantity: 1,
              },
            ],
          },
          salesUser,
        ),
      ).rejects.toThrow(
        new UnprocessableEntityException(
          'Sản phẩm "Sản phẩm lỗi" đã ngừng hoạt động hoặc có giá không hợp lệ.',
        ),
      );
      expect(quotesRepository.createWithDetailsAndLog).not.toHaveBeenCalled();
    });
    it.each([0, -1])(
      'BR-12 - từ chối số lượng Product bằng %s',
      async (quantity) => {
        quotesRepository.findOwnedDeal.mockResolvedValue(ownedDeal);
        quotesRepository.findProductsByIds.mockResolvedValue([productOne]);
        await expect(
          quotesService.create(
            {
              dealId: 7,
              items: [
                {
                  productId: 1,
                  quantity,
                },
              ],
            },
            salesUser,
          ),
        ).rejects.toThrow(
          new UnprocessableEntityException('Số lượng sản phẩm phải lớn hơn 0.'),
        );
        expect(quotesRepository.createWithDetailsAndLog).not.toHaveBeenCalled();
      },
    );
  });

  describe('QuotesService - BR22, BR23, BR24', () => {
    let service: QuotesService;

    let repository: {
      findOwnedQuoteById: jest.Mock;
      findProductsByIds: jest.Mock;
      updateWithDetailsAndLog: jest.Mock;
      changeStatusWithLog: jest.Mock;
    };

    const salesUser = {
      userId: 5,
      fullName: 'Nguyễn Văn Sales',
      email: 'sales@crm.test',
      role: Role.SALES,
    } as AuthenticatedUser;

    beforeEach(() => {
      repository = {
        findOwnedQuoteById: jest.fn(),
        findProductsByIds: jest.fn(),
        updateWithDetailsAndLog: jest.fn(),
        changeStatusWithLog: jest.fn(),
      };

      service = new QuotesService(repository as unknown as QuotesRepository);
    });

    it('BR22 - từ chối chỉnh sửa Quote không ở trạng thái Draft', async () => {
      repository.findOwnedQuoteById.mockResolvedValue({
        quoteid: 20,
        status: 'Confirmed',
      });

      await expect(
        service.update(
          20,
          {
            items: [
              {
                productId: 1,
                quantity: 1,
              },
            ],
          },
          salesUser,
          '127.0.0.1',
        ),
      ).rejects.toThrow(
        'Chỉ báo giá ở trạng thái Bản nháp mới được thực hiện thao tác này.',
      );

      expect(repository.findProductsByIds).not.toHaveBeenCalled();

      expect(repository.updateWithDetailsAndLog).not.toHaveBeenCalled();
    });

    it('BR23 - từ chối hủy Quote đã Confirmed', async () => {
      repository.findOwnedQuoteById.mockResolvedValue({
        quoteid: 21,
        status: 'Confirmed',
      });

      await expect(service.cancel(21, salesUser, '127.0.0.1')).rejects.toThrow(
        'Chỉ báo giá ở trạng thái Bản nháp mới được thực hiện thao tác này.',
      );

      expect(repository.changeStatusWithLog).not.toHaveBeenCalled();
    });

    it('BR24 - hủy Quote Draft chỉ chuyển trạng thái sang Cancelled', async () => {
      const draftQuote = {
        quoteid: 22,
        dealid: 7,
        quotedate: new Date('2026-09-11T00:00:00.000Z'),
        totalamount: 35_000_000,
        status: 'Draft',
        createdby: 5,

        deals: {
          dealid: 7,
          dealname: 'Deal báo giá',
          assigneduserid: 5,

          customers: {
            customerid: 3,
            fullname: 'Khách hàng A',
            company: 'Công ty A',
          },

          pipelinestages: {
            stageid: 4,
            stagename: 'Proposal',
            stageorder: 4,
          },
        },

        users: {
          userid: 5,
          fullname: 'Nguyễn Văn Sales',
        },

        quotedetails: [],
      };

      const cancelledQuote = {
        ...draftQuote,
        status: 'Cancelled',
      };

      repository.findOwnedQuoteById.mockResolvedValue(draftQuote);

      repository.changeStatusWithLog.mockResolvedValue(cancelledQuote);

      const result = await service.cancel(22, salesUser, '127.0.0.1');

      expect(repository.changeStatusWithLog).toHaveBeenCalledWith({
        quoteId: 22,
        userId: 5,
        newStatus: 'Cancelled',
        currentQuote: draftQuote,
        ipAddress: '127.0.0.1',
      });

      expect(result.message).toBe('Hủy báo giá thành công.');

      expect(result.data.status).toBe('Cancelled');
    });

    it('BR23 - xác nhận Quote Draft thành công và chuyển trạng thái sang Confirmed', async () => {
      const draftQuote = {
        quoteid: 23,
        dealid: 7,
        quotedate: new Date('2026-09-11T00:00:00.000Z'),
        totalamount: 35_000_000,
        status: 'Draft',
        createdby: 5,

        deals: {
          dealid: 7,
          dealname: 'Deal báo giá',
          assigneduserid: 5,

          customers: {
            customerid: 3,
            fullname: 'Khách hàng A',
            company: 'Công ty A',
          },

          pipelinestages: {
            stageid: 4,
            stagename: 'Proposal',
            stageorder: 4,
          },
        },

        users: {
          userid: 5,
          fullname: 'Nguyễn Văn Sales',
        },

        quotedetails: [],
      };

      const confirmedQuote = {
        ...draftQuote,
        status: 'Confirmed',
      };

      repository.findOwnedQuoteById.mockResolvedValue(draftQuote);

      repository.changeStatusWithLog.mockResolvedValue(confirmedQuote);

      const result = await service.confirm(
        23,
        salesUser,
        '127.0.0.1',
      );

      expect(repository.findOwnedQuoteById).toHaveBeenCalledWith(
        23,
        5,
      );

      expect(repository.changeStatusWithLog).toHaveBeenCalledWith({
        quoteId: 23,
        userId: 5,
        newStatus: 'Confirmed',
        currentQuote: draftQuote,
        ipAddress: '127.0.0.1',
      });

      expect(result.message).toBe(
        'Xác nhận báo giá thành công.',
      );

      expect(result.data.status).toBe('Confirmed');
    });

    it('BR23 - từ chối xác nhận Quote không ở trạng thái Draft', async () => {
      repository.findOwnedQuoteById.mockResolvedValue({
        quoteid: 24,
        status: 'Confirmed',
      });

      await expect(
        service.confirm(
          24,
          salesUser,
          '127.0.0.1',
        ),
      ).rejects.toThrow(
        'Chỉ báo giá ở trạng thái Bản nháp mới được thực hiện thao tác này.',
      );

      expect(
        repository.changeStatusWithLog,
      ).not.toHaveBeenCalled();
    });
  });
});
