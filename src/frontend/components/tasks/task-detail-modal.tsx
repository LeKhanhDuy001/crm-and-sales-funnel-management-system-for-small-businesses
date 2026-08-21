import { getTaskPriorityLabel, getTaskStatusLabel, } from '../../modules/tasks/task-labels';
import type { Task, } from '../../modules/tasks/tasks.types';
import styles from './tasks-page.module.css';

interface Props {
  task: Task;
  onClose: () => void;
}

function formatDate(value: string | null,): string {
  if (!value) {
    return '-';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat(
    'vi-VN',
    {
      timeZone: 'Asia/Ho_Chi_Minh',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  ).format(date);
}

export default function TaskDetailModal({ task, onClose, }: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div>
            <h2>{task.taskCode}</h2>

            <p>
              {getTaskStatusLabel(task.status,)}
            </p>
          </div>

          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.detailGrid}>
          <span>Tiêu đề</span>
          <strong>
            {task.title ?? '-'}
          </strong>

          <span>Mô tả</span>
          <strong>
            {task.description ?? '-'}
          </strong>

          <span>Deal</span>
          <strong>
            {task.deal?.dealName ?? '-'}
          </strong>

          <span>Khách hàng</span>
          <strong>
            {task.deal?.customer.fullName ?? '-'}
          </strong>

          <span>Người phụ trách</span>
          <strong>
            {task.assignedUser?.fullName ?? '-'}
          </strong>

          <span>Mức độ</span>
          <strong>
            {getTaskPriorityLabel(task.priority,)}
          </strong>

          <span>Deadline</span>
          <strong>
            {formatDate(task.dueDate,)}
          </strong>

          <span>Nhắc việc</span>
          <strong>
            {formatDate(task.reminderTime,)}
          </strong>
        </div>

        <div className={styles.modalActions}>
          <button type="button" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}