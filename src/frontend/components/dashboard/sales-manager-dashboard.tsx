'use client';

import { getSalesManagerDashboard } from '../../modules/dashboard/dashboard.service';
import DashboardHeader from './dashboard-header';
import { formatCurrency, formatDate, } from './dashboard-formatters';
import DashboardState from './dashboard-state';
import styles from './role-dashboard.module.css';
import { useDashboardData } from './use-dashboard-data';

export default function SalesManagerDashboard() {
  const { data: dashboard, isLoading, error, } = useDashboardData( getSalesManagerDashboard,);

  if ( isLoading || error || !dashboard ) {
    return (
      <DashboardState isLoading={isLoading} error={error} hasData={Boolean(dashboard)}/>
    );
  }

  const { overview, pipeline, salesPerformance, attentionDeals, } = dashboard;

  const maxPipeline = Math.max( ...pipeline.map( (stage) => stage.totalDeals, ), 1,);

  return (
    <main className={styles.page}>
      <DashboardHeader
        title="Dashboard Sales Manager"
        description="Theo dõi đội ngũ Sales, Pipeline và doanh thu."
      />

      <section className={styles.statGrid}>
        <Stat
          title="Nhân viên Sales"
          value={overview.totalSales}
          icon="👥"
        />

        <Stat
          title="Deal đang mở"
          value={overview.openDeals}
          icon="🤝"
        />

        <Stat
          title="Giá trị Pipeline"
          value={formatCurrency( overview.pipelineValue,)}
          icon="📊"
        />

        <Stat
          title="Doanh thu kỳ vọng"
          value={formatCurrency( overview.expectedRevenue,)}
          icon="🎯"
        />

        <Stat
          title="Doanh thu thành công"
          value={formatCurrency( overview.wonRevenue,)}
          icon="💰"
        />

        <Stat
          title="Nhiệm vụ chưa xong"
          value={overview.pendingTasks}
          icon="✅"
        />
      </section>

      <section className={styles.contentGrid}>
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Pipeline bán hàng</h2>
            <p> Số Deal theo từng giai đoạn </p>
          </div>

          {pipeline.length === 0 ? (
            <p className={styles.empty}> Chưa có dữ liệu Pipeline.</p>
          ) : (
            <div
              className={styles.pipelineList}
            >
              {pipeline.map((stage) => (
                <div key={stage.stageId} className={ styles.pipelineItem}>
                  <div className={ styles.pipelineTop }>
                    <span> {stage.stageName} </span>

                    <strong> {stage.totalDeals} </strong>
                  </div>

                  <div className={ styles.progressTrack }>
                    <div className={styles.progressBar}
                      style={{ width: `${
                          (
                            stage.totalDeals /
                            maxPipeline
                          ) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Deal cần chú ý</h2>
            <p> Các cơ hội bán hàng cần theo dõi </p>
          </div>

          {attentionDeals.length === 0 ? (
            <p className={styles.empty}> Không có Deal cần chú ý. </p>
          ) : (
            <ul className={styles.list}>
              {attentionDeals.map(
                (deal) => (
                  <li key={deal.dealId} className={ styles.listItem}>
                    <div className={ styles.itemMain }>
                      <p className={ styles.itemTitle}>
                        {deal.dealName}
                      </p>

                      <p className={ styles.itemMeta}>
                        {deal.customer}
                        {' • '}
                        {deal.assignedUser}
                        {' • '}
                        {formatDate( deal.expectedCloseDate,)}
                      </p>
                    </div>

                    <span className={styles.badge}>
                      {deal.stage}
                    </span>
                  </li>
                ),
              )}
            </ul>
          )}
        </article>

        <article
          className={`${styles.panel} ${styles.fullWidth}`}
        >
          <div className={styles.panelHeader}>
            <h2>Hiệu suất nhân viên Sales</h2>
            <p>
              Tổng Deal và doanh thu theo từng
              nhân viên
            </p>
          </div>

          {salesPerformance.length === 0 ? (
            <p className={styles.empty}> Chưa có dữ liệu hiệu suất.</p>
          ) : (
            <div
              className={ styles.tableWrapper }
            >
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nhân viên</th>
                    <th>Email</th>
                    <th>Deal</th>
                    <th>Tổng giá trị</th>
                    <th>
                      Doanh thu kỳ vọng
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {salesPerformance.map(
                    (sales) => (
                      <tr key={sales.userId}>
                        <td>
                          {sales.fullName}
                        </td>
                        <td>{sales.email}</td>
                        <td>
                          {sales.totalDeals}
                        </td>
                        <td>
                          {formatCurrency(
                            sales.totalDealValue,
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            sales.expectedRevenue,
                          )}
                        </td>
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

interface StatProps { title: string; value: string | number; icon: string; }

function Stat({ title, value, icon, }: StatProps) {
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