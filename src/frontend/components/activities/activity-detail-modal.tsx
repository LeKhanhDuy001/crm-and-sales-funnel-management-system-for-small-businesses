import type { Activity } from '../../modules/activities/activities.types';
import styles from './activities-page.module.css';
import {
  formatActivityDate,
  getActivityStatusLabel,
  getActivityTypeLabel,
} from './activity-display.utils';

type ActivityDetailModalProps = {
  activity: Activity;
  onClose: () => void;
};

export default function ActivityDetailModal({activity, onClose,}: ActivityDetailModalProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div>
            <h2>{activity.activityCode}</h2>

            <p>
              {getActivityTypeLabel(activity.activityType)}
            </p>
          </div>

          <button type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className={styles.detailGrid}>
          <span>Nội dung</span>
          <strong>{activity.subject || '-'}</strong>

          <span>Mô tả</span>
          <strong>{activity.description || '-'}</strong>

          <span>Khách hàng</span>
          <strong>{activity.customer.fullName}</strong>

          <span>Công ty</span>
          <strong>{activity.customer.company || '-'}</strong>

          <span>Deal</span>
          <strong>{activity.deal.dealName}</strong>

          <span>Người thực hiện</span>
          <strong>{activity.user.fullName}</strong>

          <span>Thời gian</span>
          <strong>
            {formatActivityDate(activity.activityTime)}
          </strong>

          <span>Kết quả</span>
          <strong>
            {activity.result || 'Chưa cập nhật'}
          </strong>

          <span>Trạng thái</span>
          <strong>
            {getActivityStatusLabel(activity.status)}
          </strong>
        </div>

        <div className={styles.modalActions}>
          <button
            type="button"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}