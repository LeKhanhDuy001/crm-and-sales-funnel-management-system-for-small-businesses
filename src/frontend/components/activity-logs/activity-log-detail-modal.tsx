import type { ActivityLogItem, } from '../../modules/activity-logs/activity-logs.types';
import styles from './admin-activity-logs-page.module.css';

interface Props {
  log: ActivityLogItem | null;
  onClose: () => void;
}

function formatJson(value: unknown,): string {
  if (value === null || value === undefined) {
    return 'Không có dữ liệu';
  }

  return JSON.stringify(value, null, 2,);
}

function formatDateTime(value: string | null,): string {
  if (!value) {
    return 'Không có';
  }

  return new Intl.DateTimeFormat(
    'vi-VN',
    {
      dateStyle: 'short',
      timeStyle: 'medium',
      timeZone: 'Asia/Ho_Chi_Minh',
    },
  ).format(new Date(value));
}

export default function ActivityLogDetailModal({log, onClose,}: Props) {
  if (!log) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div>
            <h2>Chi tiết Activity Log</h2>

            <p>
              {`LG${String(log.logId,).padStart(4, '0')}`}
            </p>
          </div>

          <button type="button" className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.detailGrid}>
          <div>
            <span>Người thực hiện</span>
            <strong>
              {log.user?.fullName ?? 'Hệ thống'}
            </strong>
          </div>

          <div>
            <span>Email</span>
            <strong>
              {log.user?.email ?? '-'}
            </strong>
          </div>

          <div>
            <span>Hành động</span>
            <strong>
              {log.action ?? 'Không xác định'}
            </strong>
          </div>

          <div>
            <span>Bảng dữ liệu</span>
            <strong>
              {log.tableName ?? '-'}
            </strong>
          </div>

          <div>
            <span>Record ID</span>
            <strong>
              {log.recordId ?? '-'}
            </strong>
          </div>

          <div>
            <span>Thời gian</span>
            <strong>
              {formatDateTime(log.actionTime,)}
            </strong>
          </div>

          <div>
            <span>IP</span>
            <strong>
              {log.ipAddress ?? '-'}
            </strong>
          </div>
        </div>

        <div className={styles.changeGrid}>
          <section>
            <h3>Dữ liệu trước</h3>

            <pre>
              {formatJson(log.oldValue,)}
            </pre>
          </section>

          <section>
            <h3>Dữ liệu sau</h3>

            <pre>
              {formatJson(log.newValue,)}
            </pre>
          </section>
        </div>

        <div className={styles.modalFooter}>
          <button type="button" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}