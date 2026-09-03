'use client';

import { type FormEvent, useState } from 'react';
import type {Deal, DealSalesUserOption, } from '../../modules/deals/deals.types';
import styles from './deal-assignment-modal.module.css';

interface Props {
  deal: Deal;
  salesUsers: DealSalesUserOption[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (assignedUserId: number) => void;
}

export default function DealAssignmentModal({
  deal,
  salesUsers,
  isSubmitting,
  onClose,
  onSubmit,
}: Props) {
  const [assignedUserId, setAssignedUserId] = useState(deal.assignedUser.userId);
  function handleSubmit(event: FormEvent<HTMLFormElement>,): void {
    event.preventDefault();

    if (!assignedUserId) {
      return;
    }

    onSubmit(assignedUserId);
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
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

        <div className={styles.current}>
          <span>Người phụ trách hiện tại</span>
          <strong>
            {deal.assignedUser.fullName}
          </strong>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="deal-assignee">
            Nhân viên Sales *
          </label>

          <select id="deal-assignee" value={assignedUserId}
            disabled={isSubmitting}
            onChange={(event) => setAssignedUserId(Number(event.target.value),)}
          >
            <option value={0}>
              -- Chọn nhân viên Sales --
            </option>

            {salesUsers.map((sales) => (
              <option key={sales.userId} value={sales.userId}>
                {sales.fullName} - {sales.email}
              </option>
            ))}
          </select>

          {salesUsers.length === 0 && (
            <p className={styles.empty}>
              Không có nhân viên Sales đang hoạt động.
            </p>
          )}

          <div className={styles.actions}>
            <button type="button" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </button>

            <button type="submit" className={styles.primaryButton}
              disabled={isSubmitting || assignedUserId === 0}
            >
              {isSubmitting ? 'Đang phân công...' : 'Phân công'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}