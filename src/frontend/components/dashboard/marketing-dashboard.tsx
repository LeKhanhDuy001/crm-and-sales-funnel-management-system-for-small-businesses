'use client';

import { getMarketingDashboard } from '../../modules/dashboard/dashboard.service';
import DashboardHeader from './dashboard-header';
import { formatDate } from './dashboard-formatters';
import DashboardState from './dashboard-state';
import styles from './role-dashboard.module.css';
import { useDashboardData } from './use-dashboard-data';

export default function MarketingDashboard() {
  const {data: dashboard, isLoading, error,} = useDashboardData(getMarketingDashboard,);

  if (isLoading || error || !dashboard) {
    return (<DashboardState isLoading={isLoading} error={error} hasData={Boolean(dashboard)}/>);
  }

  const { overview, leadsBySource, leadsByStatus, recentLeads, } = dashboard;

  const maxSource = Math.max(...leadsBySource.map((source) => source.totalLeads,), 1,);

  return (
    <main className={styles.page}>
      <DashboardHeader title="Dashboard Marketing" description="Theo dõi nguồn Lead và hiệu quả chuyển đổi khách hàng tiềm năng."/>

      <section className={styles.statGrid}>
        <Stat title="Tổng Lead" value={overview.totalLeads} icon="👥"/>

        <Stat title="Lead mới tháng này" value={overview.newLeadsThisMonth} icon="✨"/>

        <Stat title="Đã chuyển đổi" value={overview.convertedLeads} icon="✅"/>

        <Stat title="Chưa chuyển đổi" value={overview.unconvertedLeads} icon="⏳"/>

        <Stat title="Tỷ lệ chuyển đổi" value={`${overview.conversionRate}%`} icon="📈"/>

        <Stat title="Nguồn Lead" value={overview.totalLeadSources} icon="📣"/>
      </section>

      <section className={styles.contentGrid}>
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Lead theo nguồn</h2>
            <p>Hiệu quả của từng nguồn Lead</p>
          </div>

          {leadsBySource.length === 0 ? (
            <p className={styles.empty}>Chưa có dữ liệu nguồn Lead.</p>
          ) : (
            <div>
              {leadsBySource.map((source) => (
                  <div key={source.sourceId} className={styles.sourceRow}>
                    <div className={styles.sourceTop}>
                      <span className={styles.sourceName}>
                        {source.sourceName}
                      </span>

                      <span className={styles.sourceCount}>
                        {source.totalLeads}
                      </span>
                    </div>

                    <div className={styles.progressTrack}>
                      <div className={styles.progressBar}
                        style={{
                          width: `${
                            (
                              source.totalLeads /
                              maxSource
                            ) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Lead theo trạng thái</h2>
            <p>Phân bố trạng thái Lead</p>
          </div>

          {leadsByStatus.length === 0 ? (
            <p className={styles.empty}>Chưa có dữ liệu trạng thái.</p>
          ) : (
            <ul className={styles.list}>
              {leadsByStatus.map(
                (item) => (
                  <li key={item.status} className={styles.listItem}>
                    <p className={styles.itemTitle}>
                      {item.status}
                    </p>

                    <span className={styles.badge}>
                      {item.totalLeads}
                    </span>
                  </li>
                ),
              )}
            </ul>
          )}
        </article>

        <article className={`${styles.panel} ${styles.fullWidth}`}>
          <div className={styles.panelHeader}>
            <h2>Lead mới nhất</h2>
            <p>
              Những khách hàng tiềm năng vừa được
              ghi nhận
            </p>
          </div>

          {recentLeads.length === 0 ? (
            <p className={styles.empty}>Chưa có Lead.</p>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Họ tên</th>
                    <th>Công ty</th>
                    <th>Nguồn</th>
                    <th>Trạng thái</th>
                    <th>Phụ trách</th>
                    <th>Ngày tạo</th>
                  </tr>
                </thead>

                <tbody>
                  {recentLeads.map(
                    (lead) => (
                      <tr key={lead.leadId}>
                        <td>{lead.fullName}</td>
                        <td>{lead.company ?? 'Không có'}</td>
                        <td>{lead.source ?? 'Không xác định'}</td>
                        <td>{lead.status ?? 'Chưa có'}</td>
                        <td>{lead.assignedUser ?? 'Chưa phân công'}</td>
                        <td>{formatDate(lead.createdDate,)}</td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>
    </main>
  );
}

interface StatProps {title: string; value: string | number;icon: string;}

function Stat({title, value, icon,}: StatProps) {
  return (
    <article className={styles.statCard}>
      <div className={styles.statTop}>
        <p className={styles.statTitle}>{title}</p>

        <span className={styles.statIcon}>{icon}</span>
      </div>

      <p className={styles.statValue}>{value}</p>
    </article>
  );
}