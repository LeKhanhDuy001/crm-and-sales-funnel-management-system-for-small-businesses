import RoleRouteGuard from '../../../components/auth/role-route-guard';
import CustomerCareDashboard from '../../../components/dashboard/customer-care-dashboard';

export default function CustomerCareDashboardPage() {
  return (<RoleRouteGuard allowedRole="Customer Care"> <CustomerCareDashboard /> </RoleRouteGuard>);
}