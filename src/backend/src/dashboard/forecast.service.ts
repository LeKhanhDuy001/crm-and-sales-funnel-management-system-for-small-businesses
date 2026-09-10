import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ForecastQueryDto } from './dto/forecast-query.dto';
import { ForecastRepository } from './repositories/forecast.repository';

@Injectable()
export class ForecastService {
  constructor(private readonly forecastRepository: ForecastRepository) {}
  async getForecast(query: ForecastQueryDto) {
    const fromDate = this.toUtcDate(query.fromDate);
    const toDate = this.toUtcDate(query.toDate);
    if (fromDate > toDate) {
      throw new UnprocessableEntityException(
        'Ngày bắt đầu không được sau ngày kết thúc.',
      );
    }

    const toDateExclusive = this.nextUtcDay(toDate);

    // BR-34: Forecast = tổng Expected Revenue của Deal đang mở trong kỳ được chọn.
    const result = await this.forecastRepository.aggregateOpenDealsByPeriod(
      fromDate,
      toDateExclusive,
    );

    return {
      fromDate: query.fromDate,
      toDate: query.toDate,
      totalOpenDeals: result._count._all,
      pipelineValue: Number(result._sum.dealvalue ?? 0),
      forecastRevenue: Number(result._sum.expectedrevenue ?? 0),
    };
  }

  private toUtcDate(value: string): Date {
    return new Date(`${value}T00:00:00.000Z`);
  }

  private nextUtcDay(value: Date): Date {
    const nextDate = new Date(value);
    nextDate.setUTCDate(nextDate.getUTCDate() + 1);
    return nextDate;
  }
}
