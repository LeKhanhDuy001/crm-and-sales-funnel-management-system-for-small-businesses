import type { AdminDashboardData } from './dashboard.types';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:3001';

export async function getAdminDashboard(
  accessToken: string,
): Promise<AdminDashboardData> {
  const response = await fetch(
    `${API_URL}/dashboard/admin`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    },
  );

  if (response.status === 401) {
    throw new Error(
      'Phiên đăng nhập không hợp lệ hoặc đã hết hạn',
    );
  }

  if (response.status === 403) {
    throw new Error(
      'Bạn không có quyền xem Dashboard Admin',
    );
  }

  if (!response.ok) {
    throw new Error(
      'Không thể tải dữ liệu Dashboard',
    );
  }

  return response.json() as Promise<AdminDashboardData>;
}