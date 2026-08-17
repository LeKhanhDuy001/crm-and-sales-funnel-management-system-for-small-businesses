import AdminRouteGuard from '../../../components/auth/admin-route-guard';
import AdminActivityLogsPage from '../../../components/activity-logs/admin-activity-logs-page';

export default function ActivityLogsPage() {
  return (
    <AdminRouteGuard>
      <AdminActivityLogsPage />
    </AdminRouteGuard>
  );
}