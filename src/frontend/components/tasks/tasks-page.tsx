'use client';

import { type FormEvent, useEffect, useState, } from 'react';
import { useRouter } from 'next/navigation';
import type {
  CreateTaskInput,
  Task,
  TaskAssignee,
  TaskMetaDeal,
  TaskPagination,
  TaskStatus,
} from '../../modules/tasks/tasks.types';
import TaskDetailModal from './task-detail-modal';
import TaskFormModal from './task-form-modal';
import TasksFilterBar from './tasks-filter-bar';
import styles from './tasks-page.module.css';
import {
  handleSaveTask,
  handleStatusChange,
  loadTaskPage,
  Pagination,
  TasksContent,
  TasksHeader,
  handleDeleteTask,
} from './tasks-page-helpers';
import TaskAssignmentModal from './task-assignment-modal';
import { assignTask, } from '../../modules/tasks/tasks.service';
import { getAccessToken, } from '../../modules/auth/auth.storage';
import { showTaskMutationError, } from './task-error';

const DEFAULT_PAGINATION: TaskPagination = { page: 1, limit: 20, total: 0, totalPages: 0, };

interface Props {
  canManage: boolean;
  canAssign: boolean;
}

export default function TasksPage({ canManage, canAssign, }: Props) {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [deals, setDeals] = useState<TaskMetaDeal[]>([]);
  const [assignees, setAssignees] = useState<TaskAssignee[]>([]);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting,] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [assigningTask, setAssigningTask,] = useState<Task | null>(null);

  useEffect(() => {
    void loadTaskPage({
      page,
      search,
      status,
      priority,
      router,
      canManage,
      setTasks,
      setDeals,
      setAssignees,
      setPagination,
      setIsLoading,
      setError,
    });
  }, [
    page,
    priority,
    refreshKey,
    router,
    search,
    status,
    canManage,
  ]);

  function refresh(): void {
    setRefreshKey((value) => value + 1,);
  }

  function handleSearch(event: FormEvent<HTMLFormElement>,): void {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  async function saveTask(input: CreateTaskInput,): Promise<void> {
    await handleSaveTask({
      input,
      editingTask,
      router,
      setIsSubmitting,
      setEditingTask,
      setIsCreateOpen,
      refresh,
    });
  }

  async function changeStatus(task: Task, nextStatus: TaskStatus,): Promise<void> {
    await handleStatusChange({ task, nextStatus, router, refresh, });
  }

  async function deleteTask(task: Task,): Promise<void> {
    await handleDeleteTask(task, router, refresh,);
  }

  async function handleAssign(assignedUserId: number,): Promise<void> {
    if (!assigningTask) {
      return;
    }
    const token = getAccessToken();
    if (!token) {
      router.replace('/login');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await assignTask(token, assigningTask.taskId, { assignedUserId, },);
      window.alert(response.message,);
      setAssigningTask(null);
      refresh();
    } catch (caughtError) {
      showTaskMutationError(caughtError, 'Không thể phân công Task.',);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <TasksHeader canManage={canManage}
        onCreate={() => setIsCreateOpen(true)}
      />

      <section className={styles.panel}>
        <TasksFilterBar searchInput={searchInput}
          status={status} priority={priority}
          onSearchInputChange={setSearchInput}
          onStatusChange={(value) => { setPage(1); setStatus(value); }}
          onPriorityChange={(value) => { setPage(1); setPriority(value); }}
          onSubmit={handleSearch}
        />

        <TasksContent
          tasks={tasks}
          canManage={canManage}
          canAssign={canAssign}
          isLoading={isLoading}
          error={error}
          onView={setSelectedTask}
          onAssign={setAssigningTask}
          onEdit={setEditingTask}
          onDelete={deleteTask}
          onStatusChange={changeStatus}
        />

        <Pagination pagination={pagination} onPageChange={setPage} />
      </section>

      {selectedTask && (
        <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}

      {canManage &&
        (isCreateOpen || editingTask) && (
          <TaskFormModal key={editingTask?.taskId ?? 'create'}
            task={editingTask ?? undefined}
            deals={deals}
            assignees={assignees}
            isSubmitting={isSubmitting}
            onClose={() => { setIsCreateOpen(false); setEditingTask(null); }}
            onSubmit={saveTask}
          />
        )}

      {canAssign && assigningTask && (
        <TaskAssignmentModal
          task={assigningTask}
          assignees={assignees}
          isSubmitting={isSubmitting}
          onClose={() => setAssigningTask(null)}
          onSubmit={handleAssign}
        />
      )}
    </main>
  );
}