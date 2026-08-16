import AdminRouteGuard from '../../../components/auth/admin-route-guard';
import AdminUsersPage from '../../../components/users/admin-users-page';

export default function AdminUsersRoute() {
  return (
    <AdminRouteGuard>
      <AdminUsersPage />
    </AdminRouteGuard>
  );
}