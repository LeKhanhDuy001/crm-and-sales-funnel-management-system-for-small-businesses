import styles from './AdminDashboard.module.css';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
}

export default function StatCard({
  title,
  value,
  icon,
}: StatCardProps) {
  return (
    <article className={styles.statCard}>
      <div className={styles.statTop}>
        <p className={styles.statTitle}>{title}</p>

        <div className={styles.statIcon}>
          {icon}
        </div>
      </div>

      <p className={styles.statValue}>
        {value}
      </p>
    </article>
  );
}