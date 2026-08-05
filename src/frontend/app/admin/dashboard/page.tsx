import AdminRouteGuard from '../../../components/auth/admin-route-guard';
import AdminDashboard from '../../../components/dashboard/admin-dashboard';

export default function AdminDashboardPage() {
  return (
    <AdminRouteGuard>
      <AdminDashboard />
    </AdminRouteGuard>
  );
}