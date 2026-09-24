'use client';

import { type FormEvent, useState, } from 'react';
import type { Deal, DealSalesUserOption, } from '../../modules/deals/deals.types';
import styles from './deals-page.module.css';

interface AssignDealModalProps {
  deal: Deal;
  salesUsers: DealSalesUserOption[];
  isSubmitting: boolean;
  submitError: string;
  onClose: () => void;
  onSubmit: (assignedUserId: number) => void;
}

export default function AssignDealModal({
  deal,
  salesUsers,
  isSubmitting,
  submitError,
  onClose,
  onSubmit,
}: AssignDealModalProps) {
  const [assignedUserId, setAssignedUserId] = useState(String(deal.assignedUser.userId));
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (!assignedUserId) {
      setError('Vui lòng chọn nhân viên Sales phụ trách Deal.');
      return;
    }

    setError('');
    onSubmit(Number(assignedUserId));
  }

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div>
            <h2>Phân công Deal</h2>
            <p>
              {deal.dealCode} - {deal.dealName}
            </p>
          </div>

          <button type="button" className={styles.closeButton}
            onClick={onClose} disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <form noValidate className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.readonlyBox}>
            <span>Người phụ trách hiện tại</span>
            <strong>{deal.assignedUser.fullName}</strong>
          </div>

          <label>
            Nhân viên Sales mới *
            <select value={assignedUserId} disabled={isSubmitting}
              onChange={(event) => { setAssignedUserId(event.target.value); setError(''); }}
            >
              <option value="">
                -- Chọn nhân viên Sales --
              </option>

              {salesUsers.map((sales) => (
                <option key={sales.userId} value={sales.userId}>
                  {sales.fullName}
                  {' - '}
                  {sales.openDealCount} Deal đang mở
                  {' - '}
                  {sales.openExpectedRevenue.toLocaleString('vi-VN')} VNĐ
                  {sales.recommended ? ' - Gợi ý' : ''}
                </option>
              ))}
            </select>

            {error && (
              <span className={styles.errorText}>
                {error}
              </span>
            )}
          </label>

          {submitError && (
            <p className={styles.submitError}>
              {submitError}
            </p>
          )}

          <div className={styles.modalActions}>
            <button type="button" className={styles.secondaryButton}
              onClick={onClose} disabled={isSubmitting}
            >
              Hủy
            </button>

            <button type="submit"
              className={styles.primaryButton}
              disabled={
                isSubmitting || salesUsers.length === 0 ||
                Number(assignedUserId) === deal.assignedUser.userId
              }
            >
              {isSubmitting ? 'Đang phân công...' : 'Phân công'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}