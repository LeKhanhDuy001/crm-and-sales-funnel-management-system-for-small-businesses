import RoleRouteGuard from '../../../components/auth/role-route-guard';
import MarketingDashboard from '../../../components/dashboard/marketing-dashboard';

export default function MarketingDashboardPage() {
  return (<RoleRouteGuard allowedRole="Marketing"> <MarketingDashboard /> </RoleRouteGuard>);
}