'use client';

import { useEffect, useState, } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuth, getAccessToken, } from '../../modules/auth/auth.storage';
import { getActivityLogFilterUsers, getActivityLogs, toActivityLogAction, } from '../../modules/activity-logs/activity-logs.service';
import type { ActivityLogFilterValues, ActivityLogItem, ActivityLogsPagination, ActivityLogUser, } from '../../modules/activity-logs/activity-logs.types';
import { ApiError } from '../../services/api';
import AdminDashboardLayout from '../dashboard/admin-dashboard-layout';
import DashboardHeader from '../dashboard/dashboard-header';
import ActivityLogDetailModal from './activity-log-detail-modal';
import ActivityLogFilters from './activity-log-filters';
import ActivityLogPagination from './activity-log-pagination';
import ActivityLogsTable from './activity-logs-table';
import styles from './admin-activity-logs-page.module.css';

const EMPTY_FILTERS: ActivityLogFilterValues = {userId: '', action: '', fromDate: '', toDate: '',};

const DEFAULT_PAGINATION: ActivityLogsPagination = {page: 1, limit: 20, total: 0, totalPages: 0,};

export default function AdminActivityLogsPage() {
  const router = useRouter();

  const [logs, setLogs] = useState<ActivityLogItem[]>([]);

  const [users, setUsers] = useState<ActivityLogUser[]>([]);

  const [filters, setFilters] = useState<ActivityLogFilterValues>(EMPTY_FILTERS,);

  const [appliedFilters, setAppliedFilters,] = useState<ActivityLogFilterValues>(EMPTY_FILTERS,);

  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState('');

  const [selectedLog, setSelectedLog,] = useState<ActivityLogItem | null>(null,);

  useEffect(() => {
    void loadActivityLogs({
      page,
      filters: appliedFilters,
      router,
      setLogs,
      setPagination,
      setIsLoading,
      setError,
    });
  }, [
    appliedFilters,
    page,
    router,
  ]);

  useEffect(() => {void loadFilterUsers(router, setUsers,);}, [router]);

  function handleFilterChange(field: keyof ActivityLogFilterValues, value: string,): void {
    setFilters((current) => ({...current, [field]: value,}));
  }

  function handleApply(): void {
    setPage(1);

    setAppliedFilters({...filters,});
  }

  function handleReset(): void {
    setFilters({...EMPTY_FILTERS,});
    setAppliedFilters({...EMPTY_FILTERS,});
    setPage(1);
  }

  return (
    <AdminDashboardLayout activePage="activity-logs">
      <main className={styles.page}>
        <DashboardHeader title="Activity Log"
          description="Theo dõi lịch sử thao tác của người dùng trong hệ thống CRM."
        />

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2>
                Nhật ký hoạt động
              </h2>

              <p>
                Tổng cộng{' '}
                {pagination.total}{' '}
                nhật ký
              </p>
            </div>
          </div>

          <ActivityLogFilters values={filters} users={users}
            onChange={handleFilterChange}
            onApply={handleApply}
            onReset={handleReset}
          />

          {isLoading ? (
            <p className={styles.empty}>
              Đang tải Activity Log...
            </p>
          ) : error ? (
            <p className={styles.error}>
              {error}
            </p>
          ) : logs.length === 0 ? (
            <p className={styles.empty}>
              Không có nhật ký phù hợp.
            </p>
          ) : (
            <>
              <ActivityLogsTable logs={logs} onView={setSelectedLog}/>

              <ActivityLogPagination pagination={pagination}onPageChange={setPage}/>
            </>
          )}
        </section>
      </main>

      <ActivityLogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)}
      />
    </AdminDashboardLayout>
  );
}

interface LoadLogsArguments {
  page: number;
  filters: ActivityLogFilterValues;
  router: ReturnType<typeof useRouter>;
  setLogs: (value: ActivityLogItem[],) => void;
  setPagination: (value: ActivityLogsPagination,) => void;
  setIsLoading: (value: boolean,) => void;
  setError: (value: string,) => void;
}

async function loadActivityLogs({
  page,
  filters,
  router,
  setLogs,
  setPagination,
  setIsLoading,
  setError,
}: LoadLogsArguments): Promise<void> {
  const accessToken = getAccessToken();

  if (!accessToken) {
    router.replace('/login');
    return;
  }

  try {
    setIsLoading(true);
    setError('');

    const response = await getActivityLogs(
        accessToken,
        {
          userId: filters.userId ? Number(filters.userId) : undefined,
          action: toActivityLogAction(filters.action,),
          fromDate: filters.fromDate || undefined,
          toDate: filters.toDate || undefined,
          page,
          limit: 20,
        },
      );

    setLogs(response.data);
    setPagination(response.pagination,);
  } catch (caughtError) {
    handleApiError(caughtError, router, setError,);
  } finally {
    setIsLoading(false);
  }
}

async function loadFilterUsers(
  router: ReturnType<typeof useRouter>,
  setUsers: (users: ActivityLogUser[],) => void,
): Promise<void> {
  const accessToken = getAccessToken();

  if (!accessToken) {
    return;
  }

  try {
    const response = await getActivityLogFilterUsers(accessToken,);

    setUsers(response.data);
  } catch (caughtError) {
    if (caughtError instanceof ApiError && caughtError.statusCode === 401) {
      clearAuth();
      router.replace('/login');
    }
  }
}

function handleApiError(
  error: unknown,
  router: ReturnType<typeof useRouter>,
  setError: (value: string,) => void,
): void {
  if (error instanceof ApiError) {
    if (error.statusCode === 401) {
      clearAuth();
      router.replace('/login');
      return;
    }

    if (error.statusCode === 403) {
      router.replace('/unauthorized',);
      return;
    }

    setError(error.message);
    return;
  }
  setError(
    'Không thể tải Activity Log.',
  );
}