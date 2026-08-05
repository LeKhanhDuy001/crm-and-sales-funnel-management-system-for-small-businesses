import type { ReactNode } from 'react';
import AdminRouteGuard from '../../components/auth/admin-route-guard';
import AppShell from '../../components/layout/app-shell';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <AdminRouteGuard>
      <AppShell>{children}</AppShell>
    </AdminRouteGuard>
  );
}