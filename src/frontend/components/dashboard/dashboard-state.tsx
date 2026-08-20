import styles from './role-dashboard.module.css';

interface DashboardStateProps { isLoading: boolean; error: string; hasData: boolean; }

export default function DashboardState({ isLoading, error, hasData, }: DashboardStateProps) {
  if (isLoading) {
    return (
      <main className={styles.statePage}>
        <p>Đang tải Dashboard...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.statePage}>
        <p className={styles.error}>
          {error}
        </p>
      </main>
    );
  }

  if (!hasData) {
    return (
      <main className={styles.statePage}>
        <p>Không có dữ liệu Dashboard.</p>
      </main>
    );
  }

  return null;
}