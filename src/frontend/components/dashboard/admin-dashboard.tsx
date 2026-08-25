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
import styles from './admin-dashboard.module.css';
import StatCard from './stat-card';
import { ApiError } from '../../services/api';
import AdminDashboardLayout from './admin-dashboard-layout';

export default function AdminDashboard() {
  const router = useRouter();

  const [dashboard, setDashboard] =
    useState<AdminDashboardData | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState('');

  function handleLogout(): void {
    clearAuth();
    router.replace('/login');
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

  const {
    overview,
    pipeline,
    recentLeads,
  } = dashboard;

  const revenue = new Intl.NumberFormat(
    'vi-VN',
    {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    },
  ).format(overview.totalRevenue);

  const maxPipelineValue = Math.max(
    ...pipeline.map(
      (stage) => stage.totalDeals,
    ),
    1,
  );

  return (
    <AdminDashboardLayout activePage='dashboard'>
      <div className={styles.dashboard}>
        <header className={styles.header}>
          <div className={styles.headerText}>
            <h1>Dashboard Admin</h1>

            <p>
              Tổng quan hoạt động của hệ thống CRM
            </p>
          </div>

          <div className={styles.headerActions}>
            <span className={styles.headerBadge}>
              Quản trị hệ thống
            </span>

            <button
              type="button"
              className={styles.logoutButton}
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </div>
        </header>

        <section className={styles.statsGrid}>
          <StatCard
            title="Người dùng"
            value={overview.totalUsers}
            icon="👥"
          />

          <StatCard
            title="Khách hàng tiềm năng"
            value={overview.totalLeads}
            icon="🎯"
          />

          <StatCard
            title="Khách hàng"
            value={overview.totalCustomers}
            icon="🤝"
          />

          <StatCard
            title="Cơ hội kinh doanh"
            value={overview.totalDeals}
            icon="💼"
          />

          <StatCard
            title="Sản phẩm"
            value={overview.totalProducts}
            icon="📦"
          />

          <StatCard
            title="Báo giá"
            value={overview.totalQuotes}
            icon="🧾"
          />

          <StatCard
            title="Nhiệm vụ chưa hoàn thành"
            value={overview.pendingTasks}
            icon="✅"
          />

          <StatCard
            title="Doanh thu thành công"
            value={revenue}
            icon="💰"
          />
        </section>

        <section className={styles.contentGrid}>
          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2>Pipeline bán hàng</h2>
              <span>
                Tổng quan theo từng giai đoạn
              </span>
            </div>

            <div className={styles.pipelineList}>
              {pipeline.map((stage) => {
                const percentage =
                  (stage.totalDeals /
                    maxPipelineValue) *
                  100;

                return (
                  <div
                    key={stage.stageId}
                    className={styles.pipelineItem}
                  >
                    <div className={styles.pipelineTop}>
                      <span
                        className={
                          styles.pipelineName
                        }
                      >
                        {stage.stageName}
                      </span>

                      <span
                        className={
                          styles.pipelineCount
                        }
                      >
                        {stage.totalDeals}
                      </span>
                    </div>

                    <div
                      className={
                        styles.progressTrack
                      }
                    >
                      <div
                        className={
                          styles.progressBar
                        }
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2>Lead mới nhất</h2>
              <span>
                5 Lead gần đây
              </span>
            </div>

            <div className={styles.leadList}>
              {recentLeads.length === 0 && (
                <p className={styles.empty}>
                  Chưa có Lead nào
                </p>
              )}

              {recentLeads.map((lead) => (
                <div
                  key={lead.leadId}
                  className={styles.leadItem}
                >
                  <div className={styles.leadInfo}>
                    <p className={styles.leadName}>
                      {lead.fullName}
                    </p>

                    <p
                      className={
                        styles.leadCompany
                      }
                    >
                      {lead.company ??
                        'Không có công ty'}
                    </p>

                    <p className={styles.leadMeta}>
                      Nguồn:{' '}
                      {lead.source ??
                        'Không xác định'}
                      {' • '}
                      Phụ trách:{' '}
                      {lead.assignedUser ??
                        'Chưa phân công'}
                    </p>
                  </div>

                  <span className={styles.status}>
                    {lead.status ?? 'Chưa có'}
                  </span>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </AdminDashboardLayout>
  );
}