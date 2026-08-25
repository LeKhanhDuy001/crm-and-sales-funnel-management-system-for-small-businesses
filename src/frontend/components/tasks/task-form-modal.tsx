'use client';

import { type FormEvent, useState, } from 'react';
import type { CreateTaskInput, Task, TaskAssignee, TaskMetaDeal, TaskPriority, } from '../../modules/tasks/tasks.types';
import { getTaskPriorityLabel, } from '../../modules/tasks/task-labels';
import styles from './tasks-page.module.css';

interface Props {
  task?: Task;
  deals: TaskMetaDeal[];
  assignees: TaskAssignee[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (input: CreateTaskInput,) => Promise<void>;
}

function toDateTimeInput(value: string | null,): string {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset,).toISOString().slice(0, 16);
}

function getReminderError(reminderTime: string, dueDate: string,): string {
  if (!reminderTime) {
    return '';
  }
  const reminderDate = new Date(reminderTime);
  if (reminderDate.getTime() <= Date.now()) {
    return 'Thời gian nhắc phải lớn hơn thời điểm hiện tại.';
  }
  if (dueDate && reminderDate.getTime() >= new Date(dueDate).getTime()) {
    return 'Thời gian nhắc phải trước thời hạn hoàn thành.';
  }

  return '';
}

export default function TaskFormModal({ task, deals, assignees, isSubmitting, onClose, onSubmit, }: Props) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '',);
  const [dealId, setDealId] = useState(task?.deal?.dealId ?? deals[0]?.dealId ?? 0,);
  const [assignedUserId, setAssignedUserId,] = useState(task?.assignedUser?.userId ?? assignees[0]?.userId ?? 0,);
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? 'Medium',);
  const [dueDate, setDueDate] = useState(toDateTimeInput(task?.dueDate ?? null,),);
  const [reminderTime, setReminderTime,] = useState(toDateTimeInput(task?.reminderTime ?? null,),);
  const [titleError, setTitleError] = useState('');
  const [reminderError, setReminderError,] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>,): void {
    event.preventDefault();

    if (!title.trim()) {
      setTitleError('Tiêu đề Task không được để trống.',);
      return;
    }
    setTitleError('');
    const nextReminderError = getReminderError(reminderTime, dueDate,);

    if (nextReminderError) {
      setReminderError(nextReminderError,);
      return;
    }

    setReminderError('');

    void onSubmit({
      dealId: dealId || undefined,
      assignedUserId: assignedUserId || undefined,
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: new Date(dueDate,).toISOString(),
      reminderTime:
        reminderTime ? new Date(reminderTime,).toISOString() : undefined,
      priority,
    });
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <TaskFormHeader isEdit={Boolean(task)}
          disabled={isSubmitting} onClose={onClose}
        />

        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.fullField}>
              <label htmlFor="task-title">
                Tiêu đề *
              </label>

              <input id="task-title" value={title}
                maxLength={200} onChange={(event) => setTitle(event.target.value,)}
              />

              {titleError && (
                <p className={styles.fieldError}>
                  {titleError}
                </p>
              )}
            </div>

            <div className={styles.fullField}>
              <label htmlFor="task-description">
                Mô tả
              </label>

              <textarea id="task-description" rows={4} value={description}
                onChange={(event) => setDescription(event.target.value,)}
              />
            </div>

            <SelectDeal deals={deals} value={dealId} onChange={setDealId} />

            <SelectAssignee assignees={assignees} value={assignedUserId} onChange={setAssignedUserId} />

            <div>
              <label htmlFor="task-priority">
                Mức độ ưu tiên *
              </label>

              <select id="task-priority" value={priority}
                onChange={(event) => setPriority(event.target.value as TaskPriority,)}
              >
                {(
                  [
                    'Low',
                    'Medium',
                    'High',
                  ] as TaskPriority[]
                ).map((item) => (
                  <option key={item} value={item}>
                    {getTaskPriorityLabel(item,)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="task-due-date">
                Thời hạn *
              </label>

              <input id="task-due-date" type="datetime-local" required
                value={dueDate} onChange={(event) => setDueDate(event.target.value,)}
              />
            </div>

            <div>
              <label htmlFor="task-reminder">
                Thời gian nhắc
              </label>
              <input id="task-reminder" type="datetime-local"
                value={reminderTime} onChange={(event) => {
                  setReminderTime(event.target.value,);
                  setReminderError('');
                }}
              />
              {reminderError && (
                <p className={styles.fieldError}>
                  {reminderError}
                </p>
              )}
            </div>
          </div>

          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </button>

            <button type="submit" className={styles.primaryButton}
              disabled={isSubmitting || !dueDate}
            >
              {isSubmitting ? 'Đang lưu...' : task ? 'Lưu thay đổi' : 'Tạo Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TaskFormHeader({ isEdit, disabled, onClose, }: {
  isEdit: boolean;
  disabled: boolean;
  onClose: () => void;
}) {
  return (
    <div className={styles.modalHeader}>
      <div>
        <h2>
          {isEdit ? 'Cập nhật Task' : 'Tạo Task'}
        </h2>

        <p>
          Nhập thông tin công việc
          cần thực hiện.
        </p>
      </div>

      <button type="button" onClick={onClose} disabled={disabled}>
        ×
      </button>
    </div>
  );
}

function SelectDeal({ deals, value, onChange, }: {
  deals: TaskMetaDeal[];
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label htmlFor="task-deal">
        Deal
      </label>

      <select id="task-deal" value={value}
        onChange={(event) => onChange(Number(event.target.value,),)}
      >
        <option value={0}>
          Không gắn Deal
        </option>

        {deals.map((deal) => (
          <option key={deal.dealId} value={deal.dealId}>
            {deal.dealName} -{' '}
            {deal.customer.fullName}
          </option>
        ))}
      </select>
    </div>
  );
}

function SelectAssignee({ assignees, value, onChange, }: {
  assignees: TaskAssignee[];
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label htmlFor="task-assignee">
        Người phụ trách *
      </label>

      <select id="task-assignee" value={value} required
        onChange={(event) => onChange(Number(event.target.value,),)}
      >
        {assignees.map(
          (assignee) => (
            <option key={assignee.userId} value={assignee.userId}>
              {assignee.fullName}
            </option>
          ),
        )}
      </select>
    </div>
  );
}