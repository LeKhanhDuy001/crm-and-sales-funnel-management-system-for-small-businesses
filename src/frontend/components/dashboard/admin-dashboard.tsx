'use client';

import {
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import {
  clearAuth,
  getAccessToken,
} from '../../modules/auth/auth.storage';
import { getAdminDashboard } from '../../modules/dashboard/dashboard.service';
import type { AdminDashboardData } from '../../modules/dashboard/dashboard.types';
import { ApiError } from '../../services/api';
import AdminDashboardLayout from './admin-dashboard-layout';
import AdminDashboardContent from './admin-dashboard-content';
import styles from './admin-dashboard.module.css';
import { logout } from '../../modules/auth/auth.service';

export default function AdminDashboard() {
  const router = useRouter();

  const [dashboard, setDashboard] =
    useState<AdminDashboardData | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState('');

  async function handleLogout(): Promise<void> {
    const accessToken = getAccessToken();

    try {
      if (accessToken) {
        await logout(accessToken);
      }
    } finally {
      clearAuth();
      router.replace('/login');
    }
  }

  useEffect(() => {
    async function loadDashboard(): Promise<void> {
      const accessToken = getAccessToken();

      if (!accessToken) {
        router.replace('/login');
        return;
      }

      try {
        const data =
          await getAdminDashboard(accessToken);

        setDashboard(data);
      } catch (caughtError) {
        if (caughtError instanceof ApiError) {
          if (caughtError.statusCode === 401) {
            clearAuth();
            router.replace('/login');
            return;
          }

          if (caughtError.statusCode === 403) {
            router.replace('/unauthorized');
            return;
          }

          setError(caughtError.message);
          return;
        }

        setError('Đã xảy ra lỗi khi tải Dashboard');
      } finally {
        setIsLoading(false);
      }
    }

    void loadDashboard();
  }, [router]);

  if (isLoading) {
    return (
      <AdminDashboardLayout activePage="dashboard">
        <div className={styles.dashboard}>
          <p className={styles.empty}>
            Đang tải Dashboard...
          </p>
        </div>
      </AdminDashboardLayout>
    );
  }

  if (error) {
    return (
      <AdminDashboardLayout activePage="dashboard">
        <div className={styles.dashboard}>
          <p className={styles.empty} style={{ color: '#dc2626' }}>
            {error}
          </p>
        </div>
      </AdminDashboardLayout>
    );
  }

  if (!dashboard) {
    return <p>Không có dữ liệu Dashboard.</p>;
  }

  return (
    <AdminDashboardLayout activePage="dashboard">
      <AdminDashboardContent dashboard={dashboard} onLogout={handleLogout} />
    </AdminDashboardLayout>
  );
}