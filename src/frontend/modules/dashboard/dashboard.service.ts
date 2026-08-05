import { apiRequest } from '../../services/api';
import type { AdminDashboardData } from './dashboard.types';

/**
 * Lấy dữ liệu Dashboard dành cho Admin.
 *
 * @param accessToken Token xác thực của người dùng.
 * @returns Dữ liệu tổng hợp của Dashboard Admin.
 */
export async function getAdminDashboard(
  accessToken: string,
): Promise<AdminDashboardData> {
  return apiRequest<AdminDashboardData>(
    '/dashboard/admin',
    {
      method: 'GET',
      accessToken,
      cache: 'no-store',
    },
  );
}