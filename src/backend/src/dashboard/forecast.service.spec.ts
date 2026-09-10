import { Prisma } from '../../generated/prisma/client';
import { ForecastService } from './forecast.service';
import { ForecastRepository } from './repositories/forecast.repository';

type ForecastRepositoryMock = { aggregateOpenDealsByPeriod: jest.Mock };

describe('ForecastService - dự báo doanh thu theo kỳ', () => {
  let forecastService: ForecastService;
  let forecastRepository: ForecastRepositoryMock;

  beforeEach(() => {
    forecastRepository = { aggregateOpenDealsByPeriod: jest.fn() };
    forecastService = new ForecastService(
      forecastRepository as unknown as ForecastRepository,
    );
  });

  it('BR-34 - tổng hợp Forecast của Deal đang mở trong kỳ', async () => {
    forecastRepository.aggregateOpenDealsByPeriod.mockResolvedValue({
      _count: { _all: 3 },
      _sum: {
        dealvalue: new Prisma.Decimal(50_000_000),
        expectedrevenue: new Prisma.Decimal(28_500_000),
      },
    });

    const result = await forecastService.getForecast({
      fromDate: '2026-09-01',
      toDate: '2026-09-30',
    });

    expect(forecastRepository.aggregateOpenDealsByPeriod).toHaveBeenCalledWith(
      new Date('2026-09-01T00:00:00.000Z'),
      new Date('2026-10-01T00:00:00.000Z'),
    );

    expect(result).toEqual({
      fromDate: '2026-09-01',
      toDate: '2026-09-30',
      totalOpenDeals: 3,
      pipelineValue: 50_000_000,
      forecastRevenue: 28_500_000,
    });
  });

  it('BR-34 - trả các tổng bằng 0 khi kỳ không có Deal', async () => {
    forecastRepository.aggregateOpenDealsByPeriod.mockResolvedValue({
      _count: { _all: 0 },
      _sum: {
        dealvalue: null,
        expectedrevenue: null,
      },
    });

    const result = await forecastService.getForecast({
      fromDate: '2026-09-01',
      toDate: '2026-09-30',
    });

    expect(result.totalOpenDeals).toBe(0);
    expect(result.pipelineValue).toBe(0);
    expect(result.forecastRevenue).toBe(0);
  });

  it('BR-34 - từ chối khi ngày bắt đầu sau ngày kết thúc', async () => {
    await expect(
      forecastService.getForecast({
        fromDate: '2026-10-01',
        toDate: '2026-09-30',
      }),
    ).rejects.toThrow('Ngày bắt đầu không được sau ngày kết thúc.');

    expect(
      forecastRepository.aggregateOpenDealsByPeriod,
    ).not.toHaveBeenCalled();
  });

  it('BR-34 - cho phép Forecast trong cùng một ngày', async () => {
    forecastRepository.aggregateOpenDealsByPeriod.mockResolvedValue({
      _count: { _all: 1 },
      _sum: {
        dealvalue: new Prisma.Decimal(10_000_000),
        expectedrevenue: new Prisma.Decimal(5_000_000),
      },
    });

    await forecastService.getForecast({
      fromDate: '2026-09-15',
      toDate: '2026-09-15',
    });

    expect(forecastRepository.aggregateOpenDealsByPeriod).toHaveBeenCalledWith(
      new Date('2026-09-15T00:00:00.000Z'),
      new Date('2026-09-16T00:00:00.000Z'),
    );
  });
});
