import type { ReactNode } from 'react';
import RoleRouteGuard from '../../components/auth/role-route-guard';
import SalesSidebar from '../../components/layout/sales-sidebar';
import styles from './sales-layout.module.css';

interface SalesLayoutProps {
  children: ReactNode;
}

export default function SalesLayout({
  children,
}: SalesLayoutProps) {
  return (
    <RoleRouteGuard allowedRole="Sales">
      <div className={styles.layout}>
        <SalesSidebar />

        <main className={styles.content}>
          {children}
        </main>
      </div>
    </RoleRouteGuard>
  );
} 