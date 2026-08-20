'use client';

import { type FormEvent, useState, } from 'react';
import type { Task, TaskAssignee, } from '../../modules/tasks/tasks.types';
import styles from './tasks-page.module.css';

interface Props {
  task: Task;
  assignees: TaskAssignee[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (assignedUserId: number,) => Promise<void>;
}

export default function TaskAssignmentModal({task, assignees, isSubmitting, onClose, onSubmit,}: Props) {
  const [assignedUserId, setAssignedUserId] = useState(task.assignedUser?.userId ?? assignees[0]?.userId ?? 0,);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>,): Promise<void> {
    event.preventDefault();

    if (!assignedUserId) {
      setError('Vui lòng chọn nhân viên Sales.',);
      return;
    }
    setError('');
    await onSubmit(assignedUserId,);
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}
        role="dialog" aria-modal="true"
        aria-labelledby="assignment-title"
      >
        <div className={styles.modalHeader}>
          <div>
            <h2 id="assignment-title">
              Phân công Task
            </h2>

            <p>
              {task.taskCode}
              {' - '}
              {task.title}
            </p>
          </div>

          <button type="button" onClick={onClose}
            disabled={isSubmitting} aria-label="Đóng"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.fullField}>
              <label htmlFor="assignedUserId">
                Nhân viên Sales
              </label>

              <select id="assignedUserId" value={assignedUserId}
                onChange={(event) => setAssignedUserId(Number(event.target.value,),)}
                disabled={isSubmitting}
              >
                <option value={0}>
                  -- Chọn nhân viên --
                </option>

                {assignees.map(
                  (assignee) => (
                    <option key={assignee.userId}
                      value={assignee.userId}
                    >
                      {assignee.fullName}
                      {' - '}
                      {assignee.email}
                    </option>
                  ),
                )}
              </select>

              {error && (
                <p className={styles.fieldError}>
                  {error}
                </p>
              )}
            </div>
          </div>

          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </button>

            <button type="submit" className={styles.primaryButton}
              disabled={isSubmitting || !assignedUserId}
            >
              {isSubmitting ? 'Đang phân công...' : 'Xác nhận phân công'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}