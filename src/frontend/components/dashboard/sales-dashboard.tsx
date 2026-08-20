'use client';

import { getSalesDashboard } from '../../modules/dashboard/dashboard.service';
import DashboardHeader from './dashboard-header';
import { formatCurrency, formatDate, formatDateTime, } from './dashboard-formatters';
import DashboardState from './dashboard-state';
import styles from './role-dashboard.module.css';
import { useDashboardData } from './use-dashboard-data';

export default function SalesDashboard() {
  const { data: dashboard, isLoading, error,} = useDashboardData(getSalesDashboard,);

  if ( isLoading || error || !dashboard) {
    return (
      <DashboardState isLoading={isLoading} error={error} hasData={Boolean(dashboard)}/>
    );
  }

  const { overview, pipeline, recentDeals, upcomingTasks, } = dashboard;

  const maxPipeline = Math.max(...pipeline.map((stage) => stage.totalDeals,),1,);

  return (
    <main className={styles.page}>
      <DashboardHeader title="Dashboard Sales" description="Theo dõi Lead, Deal và nhiệm vụ được giao cho bạn."/>

      <section className={styles.statGrid}>
        <Stat title="Lead được giao" value={overview.totalLeads} icon="🎯"/>

        <Stat title="Deal của tôi" value={overview.totalDeals} icon="🤝"/>

        <Stat title="Giá trị Pipeline" value={formatCurrency( overview.pipelineValue,)} icon="📊"/>

        <Stat title="Doanh thu kỳ vọng" value={formatCurrency( overview.expectedRevenue,)} icon="💰"/>

        <Stat title="Báo giá" value={overview.totalQuotes} icon="📄"/>

        <Stat title="Nhiệm vụ chưa xong" value={overview.pendingTasks} icon="✅"/>
      </section>

      <section className={styles.contentGrid}>
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Pipeline của tôi</h2>
            <p>Deal của bạn theo từng giai đoạn</p>
          </div>

          {pipeline.length === 0 ? (
            <p className={styles.empty}>Chưa có Deal trong Pipeline.</p>
          ) : (
            <div className={styles.pipelineList}>
              {pipeline.map((stage) => (
                <div key={stage.stageId} className={styles.pipelineItem}>
                  <div className={ styles.pipelineTop } >
                    <span>{stage.stageName}</span>

                    <strong>{stage.totalDeals}</strong>
                  </div>

                  <div className={styles.progressTrack}>
                    <div className={styles.progressBar}
                      style={{
                        width: `${
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
            <h2>Nhiệm vụ sắp tới</h2>
            <p> Công việc cần xử lý</p>
          </div>

          {upcomingTasks.length === 0 ? (
            <p className={styles.empty}>Không có nhiệm vụ sắp tới.</p>
          ) : (
            <ul className={styles.list}>
              {upcomingTasks.map(
                (task) => (<li key={task.taskId} className={ styles.listItem}>
                    <div className={styles.itemMain}>
                      <p className={styles.itemTitle}>
                        {task.title ??'Không có tiêu đề'}
                      </p>

                      <p className={ styles.itemMeta}>
                        {task.customer ?? 'Chưa có khách hàng'}{' • '}
                        {formatDateTime(task.dueDate,)}
                      </p>
                    </div>

                    <span className={styles.badge}>
                      {task.priority ?? 'Normal'}
                    </span>
                  </li>
                ),
              )}
            </ul>
          )}
        </article>

        <article className={`${styles.panel} ${styles.fullWidth}`}>
          <div className={styles.panelHeader}>
            <h2>Deal gần đây</h2>
            <p>Các Deal được cập nhật gần nhất</p>
          </div>

          {recentDeals.length === 0 ? (
            <p className={styles.empty}>Chưa có Deal.</p>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Deal</th>
                    <th>Khách hàng</th>
                    <th>Giai đoạn</th>
                    <th>Giá trị</th>
                    <th>Xác suất</th>
                    <th>Ngày dự kiến</th>
                  </tr>
                </thead>

                <tbody>
                  {recentDeals.map(
                    (deal) => (
                      <tr key={deal.dealId}>
                        <td>{deal.dealName}</td>
                        <td>{deal.customer}</td>
                        <td>{deal.stage}</td>
                        <td>{formatCurrency(deal.dealValue,)}
                        </td>
                        <td>{deal.probability ??0}%</td>
                        <td>{formatDate(deal.expectedCloseDate,)}</td>
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

interface StatProps {title: string; value: string | number; icon: string;}

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