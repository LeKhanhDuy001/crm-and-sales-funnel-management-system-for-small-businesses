'use client';

import { type FormEvent, useState, } from 'react';
import type { ActivityDealOption, ActivityType, CreateActivityInput, } from '../../modules/activities/activities.types';
import styles from './activities-page.module.css';

interface Props {
  deals: ActivityDealOption[];
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (input: CreateActivityInput,) => Promise<string | null>;
}

interface ActivityFormErrors {
  dealId?: string;
  subject?: string;
  description?: string;
  activityTime?: string;
}

function getCurrentDateTimeLocal(): string {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60_000,);
  return localDate.toISOString().slice(0, 16);
}

export default function CreateActivityModal({
  deals,
  isSaving,
  onClose,
  onSubmit,
}: Props) {
  const [dealId, setDealId] = useState('');
  const [activityType, setActivityType] = useState<ActivityType>('Call');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [activityTime, setActivityTime] = useState(getCurrentDateTimeLocal());
  const [fieldErrors, setFieldErrors] = useState<ActivityFormErrors>({});
  const [formError, setFormError] = useState('');
  const selectedDeal = deals.find((deal) => deal.dealId === Number(dealId),) ?? null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>,): Promise<void> {
    event.preventDefault();
    const errors =
      validateActivityForm({
        dealId,
        subject,
        description,
        activityTime,
      });

    setFieldErrors(errors);
    setFormError('');

    if (Object.keys(errors).length > 0) {
      return;
    }

    const error = await onSubmit({
      dealId: Number(dealId),
      activityType,
      subject: subject.trim(),
      description: description.trim(),
      activityTime: new Date(activityTime).toISOString(),
    });

    if (error) {
      setFormError(error);
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <div className={styles.modalHeader}>
          <div>
            <h2>Thêm hoạt động chăm sóc</h2>
            <p>
              Ghi nhận cuộc gọi, email hoặc cuộc
              hẹn với khách hàng.
            </p>
          </div>
          <button type="button" className={styles.closeButton}
            onClick={onClose} disabled={isSaving}
          >
            ×
          </button>
        </div>

        <form className={styles.activityForm}
          onSubmit={(event) => { void handleSubmit(event); }}
        >
          <div className={styles.formField}>
            <label htmlFor="activity-deal">
              Deal liên quan
            </label>

            <select id="activity-deal" value={dealId}
              onChange={(event) => { setDealId(event.target.value); }}
            >
              <option value="">
                -- Chọn Deal --
              </option>

              {deals.map((deal) => (
                <option key={deal.dealId} value={deal.dealId}>
                  {deal.dealName}
                </option>
              ))}
            </select>

            {fieldErrors.dealId && (
              <span className={styles.fieldError}>
                {fieldErrors.dealId}
              </span>
            )}
          </div>

          {selectedDeal && (
            <div className={styles.customerPreview}>
              <span>Khách hàng</span>

              <strong>
                {selectedDeal.customer.fullName}
              </strong>

              <small>
                {selectedDeal.customer.company ??
                  'Không có thông tin công ty'}
              </small>
            </div>
          )}

          <div className={styles.formField}>
            <label htmlFor="activity-type">
              Loại hoạt động
            </label>

            <select id="activity-type" value={activityType}
              onChange={(event) => { setActivityType(event.target.value as ActivityType,); }}
            >
              <option value="Call">
                Gọi điện
              </option>

              <option value="Email">
                Email
              </option>

              <option value="Meeting">
                Cuộc hẹn
              </option>
            </select>
          </div>

          <div className={styles.formField}>
            <label htmlFor="activity-subject">
              Tiêu đề
            </label>

            <input id="activity-subject" value={subject}
              maxLength={200} onChange={(event) => { setSubject(event.target.value); }}
            />

            {fieldErrors.subject && (
              <span className={styles.fieldError}>
                {fieldErrors.subject}
              </span>
            )}
          </div>

          <div className={styles.formField}>
            <label htmlFor="activity-description">
              Mô tả
            </label>

            <textarea
              id="activity-description"
              rows={4}
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
              }}
            />

            {fieldErrors.description && (
              <span className={styles.fieldError}>
                {fieldErrors.description}
              </span>
            )}
          </div>

          <div className={styles.formField}>
            <label htmlFor="activity-time">
              Thời gian hoạt động
            </label>

            <input id="activity-time" type="datetime-local"
              value={activityTime} onChange={(event) => { setActivityTime(event.target.value); }}
            />

            {fieldErrors.activityTime && (
              <span className={styles.fieldError}>
                {fieldErrors.activityTime}
              </span>
            )}
          </div>

          {formError && (
            <p className={styles.formError}>
              {formError}
            </p>
          )}

          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} disabled={isSaving}>
              Hủy
            </button>

            <button type="submit" className={styles.saveButton} disabled={isSaving}>
              {isSaving ? 'Đang lưu...' : 'Lưu hoạt động'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function validateActivityForm(values: {
  dealId: string;
  subject: string;
  description: string;
  activityTime: string;
}): ActivityFormErrors {
  const errors: ActivityFormErrors = {};

  if (
    !values.dealId ||
    Number(values.dealId) <= 0
  ) {
    errors.dealId =
      'Vui lòng chọn Deal cần chăm sóc.';
  }

  const subject = values.subject.trim();

  if (!subject) {
    errors.subject =
      'Nội dung hoạt động không được để trống.';
  } else if (subject.length > 200) {
    errors.subject =
      'Nội dung hoạt động không được vượt quá 200 ký tự.';
  }

  if (!values.description.trim()) {
    errors.description =
      'Mô tả hoạt động không được để trống.';
  }

  if (
    !values.activityTime ||
    Number.isNaN(
      new Date(values.activityTime).getTime(),
    )
  ) {
    errors.activityTime =
      'Thời gian hoạt động không hợp lệ.';
  }

  return errors;
}