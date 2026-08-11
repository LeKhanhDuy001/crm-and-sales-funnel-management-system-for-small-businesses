'use client';

import { getCustomerCareDashboard } from '../../modules/dashboard/dashboard.service';
import DashboardHeader from './dashboard-header';
import { formatDateTime } from './dashboard-formatters';
import DashboardState from './dashboard-state';
import styles from './role-dashboard.module.css';
import { useDashboardData } from './use-dashboard-data';

export default function CustomerCareDashboard() {
    const { data: dashboard, isLoading, error, } = useDashboardData(getCustomerCareDashboard,);

    if (isLoading || error || !dashboard) {
        return (
            <DashboardState isLoading={isLoading} error={error} hasData={Boolean(dashboard)} />
        );
    }

    const { overview, upcomingTasks, recentActivities, activitiesByType, } = dashboard;

    return (
        <main className={styles.page}>
            <DashboardHeader title="Dashboard Customer Care"
                description="Theo dõi lịch chăm sóc, nhiệm vụ và hoạt động với khách hàng." />

            <section className={styles.statGrid}>
                <Stat title="Khách cần chăm sóc" value={overview.customersNeedingCare} icon="👤" />

                <Stat title="Nhiệm vụ hôm nay" value={overview.todayTasks} icon="📅" />

                <Stat title="Nhiệm vụ chưa xong" value={overview.pendingTasks} icon="✅" />

                <Stat title="Nhiệm vụ quá hạn" value={overview.overdueTasks} icon="⚠️" />

                <Stat title="Hoạt động có kết quả" value={overview.completedActivities} icon="☎️" />
            </section>

            <section className={styles.contentGrid}>
                <article className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h2>Lịch chăm sóc sắp tới</h2>
                        <p>Những nhiệm vụ cần thực hiện</p>
                    </div>

                    {upcomingTasks.length === 0 ? (
                        <p className={styles.empty}>Không có lịch chăm sóc sắp tới.</p>
                    ) : (
                        <ul className={styles.list}>
                            {upcomingTasks.map(
                                (task) => (
                                    <li key={task.taskId} className={styles.listItem}>
                                        <div className={styles.itemMain}>
                                            <p className={styles.itemTitle}>
                                                {task.title ?? 'Không có tiêu đề'}
                                            </p>

                                            <p className={styles.itemMeta}>
                                                {task.customer ?? 'Chưa có khách hàng'} {' • '} {formatDateTime(task.dueDate,)}
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

                <article className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h2>Hoạt động theo loại</h2>
                        <p>Thống kê hoạt động chăm sóc</p>
                    </div>

                    {activitiesByType.length === 0 ? (
                        <p className={styles.empty}>Chưa có hoạt động.</p>
                    ) : (
                        <ul className={styles.list}>
                            {activitiesByType.map(
                                (activity) => (
                                    <li key={activity.activityType} className={styles.listItem}>
                                        <p className={styles.itemTitle}>
                                            {activity.activityType}
                                        </p>

                                        <span className={styles.badge}>
                                            {activity.totalActivities}
                                        </span>
                                    </li>
                                ),
                            )}
                        </ul>
                    )}
                </article>

                <article className={`${styles.panel} ${styles.fullWidth}`}>
                    <div className={styles.panelHeader}>
                        <h2>Hoạt động gần đây</h2>
                        <p>Lịch sử chăm sóc khách hàng gần nhất</p>
                    </div>

                    {recentActivities.length === 0 ? (
                        <p className={styles.empty}>Chưa có hoạt động.</p>
                    ) : (
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Loại</th>
                                        <th>Chủ đề</th>
                                        <th>Khách hàng</th>
                                        <th>Deal</th>
                                        <th>Thời gian</th>
                                        <th>Kết quả</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {recentActivities.map(
                                        (activity) => (
                                            <tr key={activity.activityId}>
                                                <td>{activity.activityType ?? 'Khác'}</td>
                                                <td>{activity.subject ?? 'Không có'}</td>
                                                <td>{activity.customer}</td>
                                                <td>{activity.dealName}</td>
                                                <td>{formatDateTime(activity.activityTime,)}</td>
                                                <td>{activity.result ?? 'Chưa có kết quả'}</td>
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
                <p className={styles.statTitle}>
                    {title}
                </p>

                <span className={styles.statIcon}>
                    {icon}
                </span>
            </div>

            <p className={styles.statValue}>
                {value}
            </p>
        </article>
    );
}