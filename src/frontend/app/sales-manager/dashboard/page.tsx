import RoleRouteGuard from '../../../components/auth/role-route-guard';
import SalesManagerDashboard from '../../../components/dashboard/sales-manager-dashboard';

export default function SalesManagerDashboardPage() {
  return (<RoleRouteGuard allowedRole="Sales Manager"> <SalesManagerDashboard /></RoleRouteGuard>);
}