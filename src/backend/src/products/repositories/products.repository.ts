import { Injectable } from '@nestjs/common';
import type { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export interface ProductFilter {
  search?: string;
  category?: string;
  status?: boolean;
}

export interface FindProductsOptions extends ProductFilter {
  skip: number;
  take: number;
}

export interface CreateProductData {
  productname: string;
  category: string | null;
  price: number;
  description: string | null;
  status: boolean;
}

export interface UpdateProductData {
  productname?: string;
  category?: string | null;
  price?: number;
  description?: string | null;
  status?: boolean;
}

function createWhere(filter: ProductFilter): Prisma.productsWhereInput {
  const where: Prisma.productsWhereInput = {};

  if (filter.search) {
    where.OR = [
      {
        productname: {
          contains: filter.search,
          mode: 'insensitive',
        },
      },
      {
        category: {
          contains: filter.search,
          mode: 'insensitive',
        },
      },
    ];
  }

  if (filter.category) {
    where.category = {
      equals: filter.category,
      mode: 'insensitive',
    };
  }

  if (filter.status !== undefined) {
    where.status = filter.status;
  }

  return where;
}

function createAuditValue(product: {
  productid: number;
  productname: string;
  category: string | null;
  price: unknown;
  description: string | null;
  status: boolean | null;
}) {
  return {
    productId: product.productid,
    productName: product.productname,
    category: product.category,
    price: product.price === null ? null : Number(product.price),
    description: product.description,
    status: product.status ?? true,
  };
}

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(options: FindProductsOptions) {
    const { skip, take, ...filter } = options;

    return this.prisma.products.findMany({
      where: createWhere(filter),
      orderBy: { productid: 'desc' },
      skip,
      take,
    });
  }

  count(filter: ProductFilter) {
    return this.prisma.products.count({ where: createWhere(filter) });
  }

  findById(productId: number) {
    return this.prisma.products.findUnique({
      where: { productid: productId },
    });
  }

  findByName(productName: string) {
    return this.prisma.products.findFirst({
      where: {
        productname: {
          equals: productName,
          mode: 'insensitive',
        },
      },
    });
  }

  findByNameExceptId(productName: string, productId: number) {
    return this.prisma.products.findFirst({
      where: {
        productname: {
          equals: productName,
          mode: 'insensitive',
        },
        NOT: { productid: productId },
      },
    });
  }

  async findCategories(): Promise<string[]> {
    const rows = await this.prisma.products.findMany({
      where: { category: { not: null } },
      distinct: ['category'],
      select: { category: true },
      orderBy: { category: 'asc' },
    });

    return rows
      .map((row) => row.category)
      .filter((category): category is string => Boolean(category));
  }

  countQuoteDetails(productId: number) {
    return this.prisma.quotedetails.count({
      where: { productid: productId },
    });
  }

  async create(data: CreateProductData, actorUserId: number) {
    return this.prisma.$transaction(async (transaction) => {
      const product = await transaction.products.create({ data });

      // BR-18: ghi nhật ký thao tác tạo sản phẩm.
      await transaction.activitylogs.create({
        data: {
          userid: actorUserId,
          action: 'Create',
          tablename: 'products',
          recordid: product.productid,
          newvalue: createAuditValue(product),
        },
      });

      return product;
    });
  }

  async update(
    productId: number,
    data: UpdateProductData,
    actorUserId: number,
    oldProduct: Awaited<ReturnType<ProductsRepository['findById']>>,
  ) {
    return this.prisma.$transaction(async (transaction) => {
      const product = await transaction.products.update({
        where: { productid: productId },
        data,
      });

      // BR-18: ghi khi cập nhật.
      await transaction.activitylogs.create({
        data: {
          userid: actorUserId,
          action: 'Update',
          tablename: 'products',
          recordid: productId,
          oldvalue: oldProduct ? createAuditValue(oldProduct) : undefined,
          newvalue: createAuditValue(product),
        },
      });

      return product;
    });
  }

  async deactivate(
    productId: number,
    actorUserId: number,
    oldProduct: NonNullable<
      Awaited<ReturnType<ProductsRepository['findById']>>
    >,
  ) {
    return this.prisma.$transaction(async (transaction) => {
      const product = await transaction.products.update({
        where: { productid: productId },
        data: { status: false },
      });

      // BR-18, BR-20: lưu lịch sử khi xóa mềm.
      await transaction.activitylogs.create({
        data: {
          userid: actorUserId,
          action: 'Delete',
          tablename: 'products',
          recordid: productId,
          oldvalue: createAuditValue(oldProduct),
          newvalue: createAuditValue(product),
        },
      });

      return product;
    });
  }

  async delete(
    productId: number,
    actorUserId: number,
    oldProduct: NonNullable<
      Awaited<ReturnType<ProductsRepository['findById']>>
    >,
  ): Promise<void> {
    await this.prisma.$transaction(async (transaction) => {
      await transaction.products.delete({
        where: { productid: productId },
      });

      // BR-18: ghi lại thao tác xóa vật lý.
      await transaction.activitylogs.create({
        data: {
          userid: actorUserId,
          action: 'Delete',
          tablename: 'products',
          recordid: productId,
          oldvalue: createAuditValue(oldProduct),
        },
      });
    });
  }
}
