import { Test, TestingModule } from '@nestjs/testing';

import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { Role } from '../common/enums/role.enum';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { ForecastService } from './forecast.service';
import { ForecastQueryDto } from './dto/forecast-query.dto';

describe('DashboardController', () => {
  let controller: DashboardController;

  const dashboardServiceMock = {
    getAdminDashboard: jest.fn(),
    getSalesManagerDashboard: jest.fn(),
    getSalesDashboard: jest.fn(),
    getMarketingDashboard: jest.fn(),
    getCustomerCareDashboard: jest.fn(),
  };

  const forecastServiceMock = {
    getForecast: jest.fn(),
  };

  const salesRequest = {
    user: {
      userId: 7,
      role: Role.SALES,
    },
  } as unknown as {
    user: AuthenticatedUser;
  };

  const customerCareRequest = {
    user: {
      userId: 9,
      role: Role.CUSTOMER_CARE,
    },
  } as unknown as {
    user: AuthenticatedUser;
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: DashboardService,
          useValue: dashboardServiceMock,
        },
        {
          provide: ForecastService,
          useValue: forecastServiceMock,
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('roles', () => {
    it('admin dashboard chỉ cho phép Admin', () => {
      expect(
        getMethodMetadataValues(
          DashboardController.prototype,
          'getAdminDashboard',
        ),
      ).toContainEqual([Role.ADMIN]);
    });

    it('sales manager dashboard chỉ cho phép Sales Manager', () => {
      expect(
        getMethodMetadataValues(
          DashboardController.prototype,
          'getSalesManagerDashboard',
        ),
      ).toContainEqual([Role.SALES_MANAGER]);
    });

    it('forecast cho phép Sales Manager và Admin', () => {
      expect(
        getMethodMetadataValues(DashboardController.prototype, 'getForecast'),
      ).toContainEqual([Role.SALES_MANAGER, Role.ADMIN]);
    });

    it('sales dashboard chỉ cho phép Sales', () => {
      expect(
        getMethodMetadataValues(
          DashboardController.prototype,
          'getSalesDashboard',
        ),
      ).toContainEqual([Role.SALES]);
    });

    it('marketing dashboard chỉ cho phép Marketing', () => {
      expect(
        getMethodMetadataValues(
          DashboardController.prototype,
          'getMarketingDashboard',
        ),
      ).toContainEqual([Role.MARKETING]);
    });

    it('customer care dashboard chỉ cho phép Customer Care', () => {
      expect(
        getMethodMetadataValues(
          DashboardController.prototype,
          'getCustomerCareDashboard',
        ),
      ).toContainEqual([Role.CUSTOMER_CARE]);
    });
  });

  describe('getAdminDashboard', () => {
    it('gọi dashboardService.getAdminDashboard', async () => {
      const expectedResult = {
        totalUsers: 10,
      };

      dashboardServiceMock.getAdminDashboard.mockResolvedValue(expectedResult);

      const result = await controller.getAdminDashboard();

      expect(dashboardServiceMock.getAdminDashboard).toHaveBeenCalledTimes(1);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getSalesManagerDashboard', () => {
    it('gọi dashboardService.getSalesManagerDashboard', async () => {
      const expectedResult = {
        pipeline: [],
      };

      dashboardServiceMock.getSalesManagerDashboard.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.getSalesManagerDashboard();

      expect(
        dashboardServiceMock.getSalesManagerDashboard,
      ).toHaveBeenCalledTimes(1);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getForecast', () => {
    it('gọi forecastService.getForecast với query', async () => {
      const query = {} as ForecastQueryDto;

      const expectedResult = {
        totalForecast: 0,
      };

      forecastServiceMock.getForecast.mockResolvedValue(expectedResult);

      const result = await controller.getForecast(query);

      expect(forecastServiceMock.getForecast).toHaveBeenCalledTimes(1);
      expect(forecastServiceMock.getForecast).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getSalesDashboard', () => {
    it('truyền đúng userId của Sales xuống service', async () => {
      const expectedResult = {
        pipeline: [],
        upcomingTasks: [],
      };

      dashboardServiceMock.getSalesDashboard.mockResolvedValue(expectedResult);

      const result = await controller.getSalesDashboard(salesRequest as never);

      expect(dashboardServiceMock.getSalesDashboard).toHaveBeenCalledTimes(1);

      expect(dashboardServiceMock.getSalesDashboard).toHaveBeenCalledWith(
        salesRequest.user.userId,
      );

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getMarketingDashboard', () => {
    it('gọi dashboardService.getMarketingDashboard', async () => {
      const expectedResult = {
        leadsBySource: [],
        leadsByStatus: [],
      };

      dashboardServiceMock.getMarketingDashboard.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.getMarketingDashboard();

      expect(dashboardServiceMock.getMarketingDashboard).toHaveBeenCalledTimes(
        1,
      );

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getCustomerCareDashboard', () => {
    it('truyền đúng userId của Customer Care xuống service', async () => {
      const expectedResult = {
        upcomingTasks: [],
        recentActivities: [],
      };

      dashboardServiceMock.getCustomerCareDashboard.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.getCustomerCareDashboard(
        customerCareRequest as never,
      );

      expect(
        dashboardServiceMock.getCustomerCareDashboard,
      ).toHaveBeenCalledTimes(1);

      expect(
        dashboardServiceMock.getCustomerCareDashboard,
      ).toHaveBeenCalledWith(customerCareRequest.user.userId);

      expect(result).toEqual(expectedResult);
    });
  });
});

function getMethodMetadataValues(
  prototype: object,
  methodName: string,
): unknown[] {
  const method = Object.getOwnPropertyDescriptor(prototype, methodName)
    ?.value as unknown;

  if (typeof method !== 'function') {
    throw new Error(`Không tìm thấy method ${methodName}.`);
  }

  const metadataKeys = Reflect.getMetadataKeys(method) as unknown[];

  return metadataKeys.map(
    (key): unknown => Reflect.getMetadata(key, method) as unknown,
  );
}
