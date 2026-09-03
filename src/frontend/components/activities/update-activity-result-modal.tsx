'use client';

import { type FormEvent, useState, } from 'react';
import type { Activity } from '../../modules/activities/activities.types';
import styles from './activities-page.module.css';

interface Props {
  activity: Activity;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (activityId: number, result: string,) => Promise<string | null>;
}

export default function UpdateActivityResultModal({
  activity,
  isSaving,
  onClose,
  onSubmit,
}: Props) {
  const [result, setResult] = useState(activity.result ?? '');
  const [error, setError] = useState('');
  async function handleSubmit(event: FormEvent<HTMLFormElement>,): Promise<void> {
    event.preventDefault();
    const normalizedResult = result.trim();
    if (!normalizedResult) {
      setError('Kết quả chăm sóc không được để trống.',);
      return;
    }

    setError('');
    const submitError = await onSubmit(
      activity.activityId,
      normalizedResult,
    );

    if (submitError) {
      setError(submitError);
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <div className={styles.modalHeader}>
          <div>
            <h2>Cập nhật kết quả chăm sóc</h2>

            <p>
              {activity.activityCode} -{' '}
              {activity.customer.fullName}
            </p>
          </div>

          <button type="button" className={styles.closeButton}
            onClick={onClose} disabled={isSaving}
          >
            ×
          </button>
        </div>

        <div className={styles.resultActivityInfo}>
          <span>Deal</span>
          <strong>{activity.deal.dealName}</strong>

          <span>Nội dung</span>
          <strong>{activity.subject}</strong>
        </div>

        <form className={styles.activityForm}
          onSubmit={(event) => {void handleSubmit(event);}}
        >
          <div className={styles.formField}>
            <label htmlFor="activity-result">
              Kết quả chăm sóc
            </label>

            <textarea id="activity-result" rows={5} value={result}
              onChange={(event) => {setResult(event.target.value);}}
              placeholder="Nhập kết quả sau khi tương tác với khách hàng..."
            />
          </div>

          {error && (
            <p className={styles.formError}>
              {error}
            </p>
          )}

          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} disabled={isSaving}>
              Hủy
            </button>

            <button type="submit"
              className={styles.saveButton}
              disabled={isSaving}
            >
              {isSaving ? 'Đang lưu...' : 'Lưu kết quả'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}