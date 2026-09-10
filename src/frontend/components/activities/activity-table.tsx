import type { Activity } from '../../modules/activities/activities.types';
import styles from './activities-page.module.css';
import { formatActivityDate, getActivityStatusLabel, getActivityTypeLabel, } from './activity-display.utils';

type ActivityTableProps = {
  activities: Activity[];
  cancellingActivityId: number | null;
  onSelect: (activity: Activity) => void;
  onUpdateResult: (activity: Activity) => void;
  onCancel: (activity: Activity) => Promise<void>;
};

export default function ActivityTable({
  activities,
  cancellingActivityId,
  onSelect,
  onUpdateResult,
  onCancel,
}: ActivityTableProps) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã</th>
            <th>Loại</th>
            <th>Nội dung</th>
            <th>Khách hàng</th>
            <th>Deal</th>
            <th>Thời gian</th>
            <th>Kết quả</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {activities.map((activity) => (
            <tr key={activity.activityId}>
              <td>{activity.activityCode}</td>

              <td>
                <span className={styles.typeBadge}>
                  {getActivityTypeLabel(activity.activityType)}
                </span>
              </td>

              <td>{activity.subject || '-'}</td>

              <td>
                <strong>{activity.customer.fullName}</strong>

                {activity.customer.company && (
                  <span className={styles.subText}>
                    {activity.customer.company}
                  </span>
                )}
              </td>

              <td>{activity.deal.dealName}</td>

              <td>
                {formatActivityDate(activity.activityTime)}
              </td>

              <td>
                {activity.result || 'Chưa cập nhật'}
              </td>

              <td>
                <span
                  className={`${styles.statusBadge} ${
                    styles[`status${activity.status}`]
                  }`}
                >
                  {getActivityStatusLabel(activity.status)}
                </span>
              </td>

              <td>
                <div className={styles.rowActions}>
                  <button type="button" className={styles.detailButton}
                    onClick={() => onSelect(activity)}
                  >
                    Chi tiết
                  </button>

                  {activity.status !== 'Cancelled' && (
                    <button type="button" className={styles.resultButton}
                      onClick={() => onUpdateResult(activity)}
                    >
                      Cập nhật kết quả
                    </button>
                  )}

                  {activity.status === 'Pending' && (
                    <button type="button"
                      className={styles.cancelButton}
                      disabled={cancellingActivityId === activity.activityId}
                      onClick={() => {void onCancel(activity);}}
                    >
                      {cancellingActivityId === activity.activityId ? 'Đang hủy...' : 'Hủy'}
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}