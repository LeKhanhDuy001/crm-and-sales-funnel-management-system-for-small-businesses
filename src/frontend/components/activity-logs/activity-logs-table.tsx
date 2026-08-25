import type { ActivityLogAction, ActivityLogItem, } from '../../modules/activity-logs/activity-logs.types';
import styles from './admin-activity-logs-page.module.css';

interface Props {
  logs: ActivityLogItem[];
  onView: (log: ActivityLogItem,) => void;
}

const ACTION_LABELS:
  Record<ActivityLogAction, string> = {
    Login: 'Đăng nhập',
    Logout: 'Đăng xuất',
    Create: 'Thêm mới',
    Update: 'Cập nhật',
    Delete: 'Xóa',
    Assign: 'Phân công',
    Convert: 'Chuyển đổi',
    Send_Quote: 'Gửi báo giá',
    Change_Stage: 'Đổi giai đoạn',
  };

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

function getActionLabel(action: ActivityLogAction | null,): string {
  if (!action) {
    return 'Không xác định';
  }
  return ACTION_LABELS[action];
}

export default function ActivityLogsTable({logs, onView,}: Props) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã</th>
            <th>Người dùng</th>
            <th>Hành động</th>
            <th>Đối tượng</th>
            <th>Record</th>
            <th>Thời gian</th>
            <th>IP</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => (
            <tr key={log.logId}>
              <td>
                {`LG${String(
                  log.logId,
                ).padStart(4, '0')}`}
              </td>

              <td>
                <strong>
                  {log.user?.fullName ??
                    'Hệ thống'}
                </strong>

                {log.user?.email && (
                  <span className={styles.userEmail}>
                    {log.user.email}
                  </span>
                )}
              </td>

              <td>
                {getActionLabel(log.action,)}
              </td>

              <td>
                {log.tableName ?? 'Không có'}
              </td>

              <td>
                {log.recordId ?? '-'}
              </td>

              <td>
                {formatDateTime(log.actionTime,)}
              </td>

              <td>
                {log.ipAddress ?? '-'}
              </td>

              <td>
                <button type="button" className={styles.viewButton}
                  onClick={() => onView(log)}
                >
                  Xem
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}