import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { getAccessToken } from '../../modules/auth/auth.storage';
import { createTask, getTaskMeta, getTasks, updateTask, updateTaskStatus, cancelTask, } from '../../modules/tasks/tasks.service';
import type {
  CreateTaskInput,
  Task,
  TaskAssignee,
  TaskMetaDeal,
  TaskPagination,
  TaskPriority,
  TaskStatus,
} from '../../modules/tasks/tasks.types';
import { handleTaskLoadError, showTaskMutationError, } from './task-error';
import TasksTable from './tasks-table';
import styles from './tasks-page.module.css';

interface LoadParams {
  page: number;
  search: string;
  status: string;
  priority: string;
  router: AppRouterInstance;
  canManage: boolean;
  setTasks: (tasks: Task[]) => void;
  setDeals: (deals: TaskMetaDeal[]) => void;
  setAssignees: (users: TaskAssignee[]) => void;
  setPagination: (value: TaskPagination) => void;
  setIsLoading: (value: boolean) => void;
  setError: (value: string) => void;
}

export async function loadTaskPage(params: LoadParams,): Promise<void> {
  const token = getAccessToken();

  if (!token) {
    params.router.replace('/login');
    return;
  }

  params.setIsLoading(true);
  params.setError('');

  try {
    const response = await getTasks(token, {
      search: params.search || undefined,
      status: (params.status || undefined) as | TaskStatus | undefined,
      priority: (params.priority || undefined) as | TaskPriority | undefined,
      page: params.page,
      limit: 20,
    });

    params.setTasks(response.data);

    params.setPagination(response.pagination,);

    if (!params.canManage) {
      params.setDeals([]);
      params.setAssignees([]);
      return;
    }
    const meta = await getTaskMeta(token);
    params.setDeals(meta.deals);
    params.setAssignees(meta.assignees,);
  } catch (error) {
    handleTaskLoadError(error, params.router, params.setError,);
  } finally {
    params.setIsLoading(false);
  }
}

interface SaveParams {
  input: CreateTaskInput;
  editingTask: Task | null;
  router: AppRouterInstance;
  setIsSubmitting: (value: boolean) => void;
  setEditingTask: (value: Task | null) => void;
  setIsCreateOpen: (value: boolean) => void;
  refresh: () => void;
}

export async function handleSaveTask(params: SaveParams,): Promise<void> {
  const token = getAccessToken();

  if (!token) {
    params.router.replace('/login');
    return;
  }

  params.setIsSubmitting(true);

  try {
    const response = params.editingTask
      ? await updateTask(token, params.editingTask.taskId, params.input,)
      : await createTask(token, params.input,);

    window.alert(response.message);

    params.setEditingTask(null);
    params.setIsCreateOpen(false);
    params.refresh();
  } catch (error) {
    showTaskMutationError(
      error,
      params.editingTask ? 'Không thể cập nhật Task.' : 'Không thể tạo Task.',
    );
  } finally {
    params.setIsSubmitting(false);
  }
}

interface StatusParams {
  task: Task;
  nextStatus: TaskStatus;
  router: AppRouterInstance;
  refresh: () => void;
}

export async function handleStatusChange(params: StatusParams,): Promise<void> {
  const token = getAccessToken();

  if (!token) {
    params.router.replace('/login');
    return;
  }

  try {
    await updateTaskStatus(token, params.task.taskId, params.nextStatus,);

    params.refresh();
  } catch (error) {
    showTaskMutationError(error, 'Không thể cập nhật trạng thái Task.',);
  }
}

export function TasksHeader({ canManage, onCreate, }: { canManage: boolean; onCreate: () => void; }) {
  return (
    <div className={styles.header}>
      <div>
        <h1>Quản lý Task</h1>
        <p>
          Theo dõi và quản lý các công việc cần thực hiện.
        </p>
      </div>
      {canManage && (
        <button type="button" className={styles.primaryButton} onClick={onCreate}>
          + Tạo Task
        </button>
      )}
    </div>
  );
}

interface ContentProps {
  tasks: Task[];
  canManage: boolean;
  canAssign: boolean;
  isLoading: boolean;
  error: string;
  onView: (task: Task,) => void;
  onAssign: (task: Task,) => void;
  onEdit: (task: Task,) => void;
  onDelete: (task: Task,) => void;
  onStatusChange: (task: Task, status: TaskStatus,) => void;
}

export function TasksContent({
  tasks,
  canManage,
  canAssign,
  isLoading,
  error,
  onView,
  onAssign,
  onEdit,
  onDelete,
  onStatusChange, }: ContentProps) {
  if (isLoading) {
    return <p>Đang tải Task...</p>;
  }

  if (error) {
    return (
      <p className={styles.errorMessage}>
        {error}
      </p>
    );
  }

  if (tasks.length === 0) {
    return <p>Không tìm thấy Task.</p>;
  }

  return (
    <TasksTable
      tasks={tasks}
      canManage={canManage}
      canAssign={canAssign}
      onView={onView}
      onAssign={onAssign}
      onEdit={onEdit}
      onDelete={onDelete}
      onStatusChange={onStatusChange}
    />
  );
}

export function Pagination({ pagination, onPageChange, }: {
  pagination: TaskPagination;
  onPageChange: (page: number) => void;
}) {
  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className={styles.pagination}>
      <button type="button" disabled={pagination.page <= 1}
        onClick={() => onPageChange(pagination.page - 1,)}
      >
        Trước
      </button>

      <span>
        Trang {pagination.page} /{' '}
        {pagination.totalPages}
      </span>

      <button type="button" disabled={pagination.page >= pagination.totalPages}
        onClick={() => onPageChange(pagination.page + 1,)}
      >
        Sau
      </button>
    </div>
  );
}

export async function handleDeleteTask(task: Task, router: AppRouterInstance, refresh: () => void,): Promise<void> {
  const confirmed = window.confirm(`Bạn có chắc muốn xóa Task "${task.title ?? task.taskCode}" không?`,);
  if (!confirmed) {
    return;
  }
  const token = getAccessToken();

  if (!token) {
    router.replace('/login');
    return;
  }

  try {
    const response = await cancelTask(token, task.taskId,);
    window.alert(response.message);
    refresh();
  } catch (error) {
    showTaskMutationError(error, 'Không thể xóa Task.',);
  }
}