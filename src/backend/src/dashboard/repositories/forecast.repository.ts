import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ForecastRepository {
  constructor(private readonly prisma: PrismaService) {}

  aggregateOpenDealsByPeriod(fromDate: Date, toDateExclusive: Date) {
    // BR-34: Forecast chỉ tính Deal đang mở trong kỳ.
    return this.prisma.deals.aggregate({
      where: {
        status: {
          notIn: ['Won', 'Lost'],
        },
        expectedclosedate: {
          gte: fromDate,
          lt: toDateExclusive,
        },
      },
      _count: {
        _all: true,
      },
      _sum: {
        dealvalue: true,
        expectedrevenue: true,
      },
    });
  }
}
