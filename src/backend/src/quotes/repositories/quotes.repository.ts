import { Injectable } from '@nestjs/common';
import { action_type, Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const quoteSelect = {
  quoteid: true,
  dealid: true,
  quotedate: true,
  totalamount: true,
  status: true,
  createdby: true,

  deals: {
    select: {
      dealid: true,
      dealname: true,
      assigneduserid: true,

      customers: {
        select: {
          customerid: true,
          fullname: true,
          company: true,
        },
      },

      pipelinestages: {
        select: {
          stageid: true,
          stagename: true,
          stageorder: true,
        },
      },
    },
  },

  users: {
    select: {
      userid: true,
      fullname: true,
    },
  },

  quotedetails: {
    select: {
      quotedetailid: true,
      productid: true,
      quantity: true,
      unitprice: true,
      discount: true,
      total: true,

      products: {
        select: {
          productid: true,
          productname: true,
        },
      },
    },
  },
} satisfies Prisma.quotesSelect;

export type QuoteWithRelations = Prisma.quotesGetPayload<{
  select: typeof quoteSelect;
}>;

export interface QuoteDetailCreateData {
  productId: number;
  quantity: number;
  unitPrice: Prisma.Decimal;
  total: Prisma.Decimal;
}

export interface CreateQuoteData {
  dealId: number;
  userId: number;
  totalAmount: Prisma.Decimal;
  status: string;
  items: QuoteDetailCreateData[];
  ipAddress?: string;
}

export interface UpdateQuoteData {
  quoteId: number;
  userId: number;
  totalAmount: Prisma.Decimal;
  items: QuoteDetailCreateData[];
  currentQuote: QuoteWithRelations;
  ipAddress?: string;
}

export interface ChangeQuoteStatusData {
  quoteId: number;
  userId: number;
  newStatus: string;
  currentQuote: QuoteWithRelations;
  ipAddress?: string;
}

@Injectable()
export class QuotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOwnedDeal(dealId: number, salesUserId: number) {
    return this.prisma.deals.findFirst({
      where: {
        dealid: dealId,
        assigneduserid: salesUserId,
      },
      select: {
        dealid: true,
        dealname: true,
        customerid: true,
        assigneduserid: true,

        customers: {
          select: {
            customerid: true,
            fullname: true,
          },
        },

        pipelinestages: {
          select: {
            stageid: true,
            stagename: true,
          },
        },
      },
    });
  }

  async findProductsByIds(productIds: number[]) {
    return this.prisma.products.findMany({
      where: {
        productid: { in: productIds },
      },
      select: {
        productid: true,
        productname: true,
        price: true,
        status: true,
      },
    });
  }

  async findOwnedQuotes(salesUserId: number): Promise<QuoteWithRelations[]> {
    return this.prisma.quotes.findMany({
      where: {
        deals: {
          assigneduserid: salesUserId,
        },
      },
      select: quoteSelect,
      orderBy: { quoteid: 'desc' },
    });
  }

  async findOwnedQuoteById(
    quoteId: number,
    salesUserId: number,
  ): Promise<QuoteWithRelations | null> {
    return this.prisma.quotes.findFirst({
      where: {
        quoteid: quoteId,
        deals: {
          assigneduserid: salesUserId,
        },
      },
      select: quoteSelect,
    });
  }

  async createWithDetailsAndLog(
    input: CreateQuoteData,
  ): Promise<QuoteWithRelations> {
    return this.prisma.$transaction(async (transaction) => {
      const quote = await transaction.quotes.create({
        data: {
          dealid: input.dealId,
          quotedate: new Date(),
          totalamount: input.totalAmount,
          status: input.status,
          createdby: input.userId,
          quotedetails: {
            create: input.items.map((item) => ({
              productid: item.productId,
              quantity: item.quantity,
              unitprice: item.unitPrice,
              discount: new Prisma.Decimal(0),
              total: item.total,
            })),
          },
        },
        select: quoteSelect,
      });

      await transaction.activitylogs.create({
        data: {
          userid: input.userId,
          action: action_type.Create,
          tablename: 'quotes',
          recordid: quote.quoteid,
          ipaddress: input.ipAddress ?? null,
          newvalue: {
            status: input.status,
            dealId: input.dealId,
            totalAmount: Number(input.totalAmount),
            itemCount: input.items.length,
          },
        },
      });

      return quote;
    });
  }

  async updateWithDetailsAndLog(
    input: UpdateQuoteData,
  ): Promise<QuoteWithRelations> {
    return this.prisma.$transaction(async (transaction) => {
      await transaction.quotedetails.deleteMany({
        where: {
          quoteid: input.quoteId,
        },
      });

      const updatedQuote = await transaction.quotes.update({
        where: {
          quoteid: input.quoteId,
        },
        data: {
          totalamount: input.totalAmount,

          quotedetails: {
            create: input.items.map((item) => ({
              productid: item.productId,
              quantity: item.quantity,
              unitprice: item.unitPrice,
              discount: new Prisma.Decimal(0),
              total: item.total,
            })),
          },
        },
        select: quoteSelect,
      });

      await transaction.activitylogs.create({
        data: {
          userid: input.userId,
          action: action_type.Update,
          tablename: 'quotes',
          recordid: input.quoteId,
          ipaddress: input.ipAddress ?? null,
          oldvalue: {
            status: input.currentQuote.status,
            totalAmount:
              input.currentQuote.totalamount === null
                ? null
                : Number(input.currentQuote.totalamount),
            itemCount: input.currentQuote.quotedetails.length,
          },

          newvalue: {
            status: updatedQuote.status,
            totalAmount: Number(input.totalAmount),
            itemCount: input.items.length,
          },
        },
      });

      return updatedQuote;
    });
  }

  async changeStatusWithLog(
    input: ChangeQuoteStatusData,
  ): Promise<QuoteWithRelations> {
    return this.prisma.$transaction(async (transaction) => {
      const updatedQuote = await transaction.quotes.update({
        where: {
          quoteid: input.quoteId,
        },
        data: {
          status: input.newStatus,
        },
        select: quoteSelect,
      });

      await transaction.activitylogs.create({
        data: {
          userid: input.userId,
          action: action_type.Update,
          tablename: 'quotes',
          recordid: input.quoteId,
          ipaddress: input.ipAddress ?? null,
          oldvalue: {
            status: input.currentQuote.status,
          },

          newvalue: {
            status: input.newStatus,
          },
        },
      });

      return updatedQuote;
    });
  }

  async findOwnedDealsForMeta(salesUserId: number) {
    return this.prisma.deals.findMany({
      where: {
        assigneduserid: salesUserId,
      },
      select: {
        dealid: true,
        dealname: true,

        customers: {
          select: {
            customerid: true,
            fullname: true,
            company: true,
          },
        },

        pipelinestages: {
          select: {
            stageid: true,
            stagename: true,
          },
        },
      },
      orderBy: { dealid: 'desc' },
    });
  }

  async findProductsForMeta() {
    return this.prisma.products.findMany({
      select: {
        productid: true,
        productname: true,
        category: true,
        price: true,
        status: true,
      },
      orderBy: { productname: 'asc' },
    });
  }
}
