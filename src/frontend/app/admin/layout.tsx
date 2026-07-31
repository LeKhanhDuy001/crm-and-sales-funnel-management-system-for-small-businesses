import type { ReactNode } from 'react';
import AdminRouteGuard from '../../components/auth/AdminRouteGuard';
import AppShell from '../../components/layout/AppShell';

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