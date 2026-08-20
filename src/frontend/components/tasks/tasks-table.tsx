import { getTaskPriorityLabel, getTaskStatusLabel, } from '../../modules/tasks/task-labels';
import type { Task, TaskStatus, } from '../../modules/tasks/tasks.types';
import styles from './tasks-page.module.css';

interface Props {
  tasks: Task[];
  canManage: boolean;
  canAssign: boolean;
  onView: (task: Task,) => void;
  onAssign: (task: Task,) => void;
  onEdit: (task: Task,) => void;
  onDelete: (task: Task,) => void;
  onStatusChange: (task: Task, status: TaskStatus,) => void;
}

export default function TasksTable({ tasks, canManage, canAssign, onView, onEdit, onDelete, onStatusChange, onAssign, }: Props) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã</th>
            <th>Tiêu đề</th>
            <th>Deal</th>
            <th>Người phụ trách</th>
            <th>Ưu tiên</th>
            <th>Thời hạn</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => (
            <TaskRow
              key={task.taskId}
              task={task}
              canManage={canManage}
              canAssign={canAssign}
              onView={onView}
              onAssign={onAssign}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface RowProps {
  task: Task;
  canManage: boolean;
  canAssign: boolean;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: TaskStatus,) => void;
  onAssign: (task: Task,) => void;
}

function TaskRow({ task, canManage, canAssign, onView, onAssign, onEdit, onDelete, onStatusChange, }: RowProps) {
  return (
    <tr>
      <td>{task.taskCode}</td>
      <td>{task.title ?? '-'}</td>
      <td>
        {task.deal?.dealName ?? '-'}
      </td>
      <td>
        {task.assignedUser?.fullName ?? '-'}
      </td>
      <td>
        {getTaskPriorityLabel(task.priority,)}
      </td>
      <td>
        {task.dueDate ? new Date(task.dueDate,).toLocaleString('vi-VN',) : '-'}
      </td>
      <td>
        {canManage ? (
          <select className={styles.statusSelect}
            value={task.status ?? 'Pending'}
            onChange={(event) => onStatusChange(task, event.target.value as TaskStatus,)}
          >
            <option value="Pending">
              Chờ thực hiện
            </option>

            <option value="InProgress">
              Đang thực hiện
            </option>

            <option value="Completed">
              Hoàn thành
            </option>
          </select>
        ) : (
          <span className={styles.badge}>
            {getTaskStatusLabel(task.status,)}
          </span>
        )}
      </td>

      <td>
        <div className={styles.actions}>
          <button type="button" onClick={() => onView(task)}>
            Chi tiết
          </button>

          {canAssign && (
            <button type="button" onClick={() => onAssign(task)}>
              Phân công
            </button>
          )}

          {canManage && (
            <>
              <button type="button" onClick={() => onEdit(task)}>
                Sửa
              </button>

              <button type="button" className={styles.deleteButton} onClick={() => onDelete(task)}>
                Xóa
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}