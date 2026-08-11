import RoleRouteGuard from '../../../components/auth/role-route-guard';
import SalesDashboard from '../../../components/dashboard/sales-dashboard';

export default function SalesDashboardPage() {
  return (<RoleRouteGuard allowedRole="Sales"> <SalesDashboard /> </RoleRouteGuard>);
}