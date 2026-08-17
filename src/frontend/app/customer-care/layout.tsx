import type { ReactNode } from 'react';
import RoleRouteGuard from '../../components/auth/role-route-guard';
import CustomerCareSidebar from '../../components/layout/customer-care-sidebar';
import styles from './customer-care-layout.module.css';

interface CustomerCareLayoutProps {
  children: ReactNode;
}

export default function CustomerCareLayout({
  children,
}: CustomerCareLayoutProps) {
  return (
    <RoleRouteGuard allowedRole="Customer Care">
      <div className={styles.layout}>
        <CustomerCareSidebar />

        <main className={styles.content}>
          {children}
        </main>
      </div>
    </RoleRouteGuard>
  );
}