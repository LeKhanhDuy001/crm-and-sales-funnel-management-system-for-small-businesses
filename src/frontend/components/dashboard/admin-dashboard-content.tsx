'use client';

import type { AdminDashboardData } from '../../modules/dashboard/dashboard.types';
import styles from './admin-dashboard.module.css';
import StatCard from './stat-card';
import ForecastPanel from './forecast-panel';

interface AdminDashboardContentProps {
  dashboard: AdminDashboardData;
  onLogout: () => void;
}

export default function AdminDashboardContent({ dashboard, onLogout }: AdminDashboardContentProps) {
  const { overview, pipeline, recentLeads } = dashboard;

  const revenue = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(overview.totalRevenue);

  const maxPipelineValue = Math.max(...pipeline.map((stage) => stage.totalDeals), 1);

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1>Dashboard Admin</h1>
          <p>Tổng quan hoạt động của hệ thống CRM</p>
        </div>

        <div className={styles.headerActions}>
          <span className={styles.headerBadge}>Quản trị hệ thống</span>
          <button type="button" className={styles.logoutButton} onClick={onLogout}>
            Đăng xuất
          </button>
        </div>
      </header>

      <section className={styles.statsGrid}>
        <StatCard title="Người dùng" value={overview.totalUsers} icon="👥" />
        <StatCard title="Khách hàng tiềm năng" value={overview.totalLeads} icon="🎯" />
        <StatCard title="Khách hàng" value={overview.totalCustomers} icon="🤝" />
        <StatCard title="Cơ hội kinh doanh" value={overview.totalDeals} icon="💼" />
        <StatCard title="Sản phẩm" value={overview.totalProducts} icon="📦" />
        <StatCard title="Báo giá" value={overview.totalQuotes} icon="🧾" />
        <StatCard title="Nhiệm vụ chưa hoàn thành" value={overview.pendingTasks} icon="✅" />
        <StatCard title="Doanh thu thành công" value={revenue} icon="💰" />
      </section>

      <ForecastPanel />

      <section className={styles.contentGrid}>
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Pipeline bán hàng</h2>
            <span>Tổng quan theo từng giai đoạn</span>
          </div>

          <div className={styles.pipelineList}>
            {pipeline.map((stage) => {
              const percentage = (stage.totalDeals / maxPipelineValue) * 100;

              return (
                <div key={stage.stageId} className={styles.pipelineItem}>
                  <div className={styles.pipelineTop}>
                    <span className={styles.pipelineName}>{stage.stageName}</span>
                    <span className={styles.pipelineCount}>{stage.totalDeals}</span>
                  </div>

                  <div className={styles.progressTrack}>
                    <div className={styles.progressBar} style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Lead mới nhất</h2>
            <span>5 Lead gần đây</span>
          </div>

          <div className={styles.leadList}>
            {recentLeads.length === 0 && <p className={styles.empty}>Chưa có Lead nào</p>}

            {recentLeads.map((lead) => (
              <div key={lead.leadId} className={styles.leadItem}>
                <div className={styles.leadInfo}>
                  <p className={styles.leadName}>{lead.fullName}</p>
                  <p className={styles.leadCompany}>{lead.company ?? 'Không có công ty'}</p>
                  <p className={styles.leadMeta}>
                    Nguồn: {lead.source ?? 'Không xác định'} {' • '}
                    Phụ trách: {lead.assignedUser ?? 'Chưa phân công'}
                  </p>
                </div>

                <span className={styles.status}>{lead.status ?? 'Chưa có'}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}