import AdminDashboardLayout from '../../../components/dashboard/admin-dashboard-layout';
import DealsPage from '../../../components/deals/deals-page';

export default function AdminDealsPage() {
  return (
    <AdminDashboardLayout activePage="deals">
      <DealsPage mode="admin" />
    </AdminDashboardLayout>
  );
}