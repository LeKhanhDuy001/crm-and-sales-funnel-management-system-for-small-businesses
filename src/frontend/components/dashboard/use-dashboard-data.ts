'use client';

import { useEffect, useState, } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuth, getAccessToken, } from '../../modules/auth/auth.storage';
import { ApiError } from '../../services/api';

interface DashboardState<T> {
  data: T | null;
  isLoading: boolean;
  error: string;
}

export function useDashboardData<T>( loadDashboard: ( accessToken: string,) => Promise<T>,): DashboardState<T> {
  const router = useRouter();

  const [data, setData] = useState<T | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState('');

  useEffect(() => {
    async function load(): Promise<void> {
      const accessToken = getAccessToken();

      if (!accessToken) {
        router.replace('/login');
        return;
      }

      try {
        const dashboardData = await loadDashboard(accessToken);

        setData(dashboardData);
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

        setError( 'Đã xảy ra lỗi khi tải Dashboard', );
      } finally {
        setIsLoading(false);
      }
    }

    void load();
  }, [loadDashboard, router]);

  return { data, isLoading, error, };
}