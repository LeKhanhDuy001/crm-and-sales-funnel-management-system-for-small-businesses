import type { ReactNode } from 'react';
import AdminDashboardNavigation from './admin-dashboard-navigation';
import styles from './admin-dashboard-layout.module.css';

interface AdminDashboardLayoutProps {
  activePage: | 'dashboard' | 'users' | 'products' | 'deals' | 'activity-logs';

  children: ReactNode;
}

export default function AdminDashboardLayout({activePage, children,}: AdminDashboardLayoutProps) {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>
            CRM
          </span>

          <div>
            <p className={styles.brandName}>
              CRM Admin
            </p>

            <p className={styles.brandDescription}>
              Management System
            </p>
          </div>
        </div>

        <AdminDashboardNavigation
          activePage={activePage}
        />
      </aside>

      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}