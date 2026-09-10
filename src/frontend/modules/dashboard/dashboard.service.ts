import { apiRequest } from '../../services/api';
import type {
  AdminDashboardData,
  CustomerCareDashboardData,
  ForecastData,
  ForecastQuery,
  MarketingDashboardData,
  SalesDashboardData,
  SalesManagerDashboardData,
} from './dashboard.types';

async function getDashboard<T>(endpoint: string, accessToken: string,): Promise<T> {
  return apiRequest<T>(endpoint,
    {
      method: 'GET',
      accessToken,
      cache: 'no-store',
    },
  );
}

/**
 * Lấy dữ liệu Dashboard dành cho Admin.
 *
 * @param accessToken Token xác thực của người dùng.
 * @returns Dữ liệu Dashboard Admin.
 */
export async function getAdminDashboard(
  accessToken: string,
): Promise<AdminDashboardData> {
  return getDashboard<AdminDashboardData>('/dashboard/admin', accessToken,);
}

/**
 * Lấy dữ liệu Dashboard dành cho Sales Manager.
 *
 * @param accessToken Token xác thực của người dùng.
 * @returns Dữ liệu Dashboard Sales Manager.
 */
export async function getSalesManagerDashboard(
  accessToken: string,
): Promise<SalesManagerDashboardData> {
  return getDashboard<SalesManagerDashboardData>('/dashboard/sales-manager', accessToken,);
}

/**
 * Lấy dữ liệu Dashboard cá nhân của Sales.
 *
 * @param accessToken Token xác thực của Sales.
 * @returns Dữ liệu Dashboard của Sales đang đăng nhập.
 */
export async function getSalesDashboard(
  accessToken: string,
): Promise<SalesDashboardData> {
  return getDashboard<SalesDashboardData>('/dashboard/sales', accessToken,);
}

/**
 * Lấy dữ liệu Dashboard dành cho Marketing.
 *
 * @param accessToken Token xác thực của người dùng.
 * @returns Dữ liệu Dashboard Marketing.
 */
export async function getMarketingDashboard(
  accessToken: string,
): Promise<MarketingDashboardData> {
  return getDashboard<MarketingDashboardData>('/dashboard/marketing', accessToken,);
}

/**
 * Lấy dữ liệu Dashboard cá nhân của Customer Care.
 *
 * @param accessToken Token xác thực của Customer Care.
 * @returns Dữ liệu Dashboard của Customer Care đang đăng nhập.
 */
export async function getCustomerCareDashboard(
  accessToken: string,
): Promise<CustomerCareDashboardData> {
  return getDashboard<CustomerCareDashboardData>('/dashboard/customer-care', accessToken,);
}

/**
 * Lấy Forecast doanh thu theo kỳ.
 */
export async function getForecast(accessToken: string, query: ForecastQuery,): Promise<ForecastData> {
  const params = new URLSearchParams({
    fromDate: query.fromDate,
    toDate: query.toDate,
  });

  return getDashboard<ForecastData>(
    `/dashboard/forecast?${params.toString()}`,
    accessToken,
  );
}