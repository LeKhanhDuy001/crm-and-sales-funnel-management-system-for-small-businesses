'use client';

import { type FormEvent, useMemo, useState, } from 'react';
import type { Customer } from '../../modules/customers/customers.types';
import { getTodayDateString, validateDealForm, type DealFormErrors, } from '../../modules/deals/deal-form-validation';
import { createDeal } from '../../modules/deals/deals.service';
import type { PipelineStageOption, DealSalesUserOption, } from '../../modules/deals/deals.types';
import { ApiError } from '../../services/api';
import styles from './deals-page.module.css';

interface CreateDealModalProps {
  token: string;
  customers: Customer[];
  stages: PipelineStageOption[];
  salesUsers?: DealSalesUserOption[];
  requireAssignee?: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateDealModal({ token, customers, stages, salesUsers = [], requireAssignee = false, onClose, onSuccess, }: CreateDealModalProps) {
  const [customerId, setCustomerId] = useState('');
  const [stageId, setStageId] = useState('');
  const [assignedUserId, setAssignedUserId] = useState('');
  const [assigneeError, setAssigneeError] = useState('');
  const [dealName, setDealName] = useState('');
  const [dealValue, setDealValue] = useState('');
  const [expectedCloseDate, setExpectedCloseDate,] = useState('');
  const [errors, setErrors] = useState<DealFormErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedStage = useMemo(
    () =>
      stages.find(
        (stage) => stage.stageId === Number(stageId),
      ),
    [stageId, stages],
  );

  const expectedRevenue = useMemo(() => {
    const value = Number(dealValue);
    const probability = selectedStage?.probability;

    if (Number.isNaN(value) || probability === null || probability === undefined) {
      return 0;
    }
    return value * probability / 100;
  }, [
    dealValue,
    selectedStage,
  ]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>,): Promise<void> {
    event.preventDefault();

    const validationErrors = validateDealForm(
      {
        customerId,
        stageId,
        dealName,
        dealValue,
        expectedCloseDate,
      },
      true,
    );

    const nextAssigneeError = requireAssignee && !assignedUserId ? 'Vui lòng chọn nhân viên Sales phụ trách Deal.' : '';

    setErrors(validationErrors);
    setAssigneeError(nextAssigneeError);

    if (Object.keys(validationErrors).length > 0 || nextAssigneeError) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError('');

      const response = await createDeal(
        token,
        {
          customerId: Number(customerId),
          stageId: Number(stageId),
          dealName: dealName.trim(),
          dealValue: Number(dealValue),
          expectedCloseDate: expectedCloseDate || undefined,
          ...(requireAssignee ? { assignedUserId: Number(assignedUserId), } : {}),
        },
      );
      window.alert(response.message);
      onSuccess();
    } catch (caughtError) {
      if (caughtError instanceof ApiError) {
        setSubmitError(caughtError.message,);
        return;
      }

      setSubmitError('Không thể tạo Deal.',);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Thêm Deal mới</h2>

          <button type="button" className={styles.closeButton} onClick={onClose} disabled={isSubmitting}>
            ×
          </button>
        </div>

        <form noValidate onSubmit={handleSubmit} className={styles.form}>
          <label>
            Customer *
            <select value={customerId}
              onChange={(event) => setCustomerId(event.target.value,)}
            >
              <option value="">
                -- Chọn Customer --
              </option>

              {customers.map((customer) => (
                <option key={customer.customerId} value={customer.customerId}>
                  {customer.fullName}
                  {customer.company ? ` - ${customer.company}` : ''}
                </option>
              ))}
            </select>

            {errors.customerId && (
              <span className={styles.errorText}>
                {errors.customerId}
              </span>
            )}
          </label>

          {requireAssignee && (
            <label>
              Nhân viên Sales phụ trách *
              <select value={assignedUserId} disabled={isSubmitting}
                onChange={(event) => {
                  setAssignedUserId(event.target.value);
                  setAssigneeError('');
                }}

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

              {assigneeError && (
                <span className={styles.errorText}>
                  {assigneeError}
                </span>
              )}
            </label>
          )}

          {requireAssignee && salesUsers.length === 0 && (
            <p className={styles.submitError}>
              Không có nhân viên Sales đang hoạt động để phân công.
            </p>
          )}

          <label>
            Tên Deal *
            <input value={dealName}
              onChange={(event) => setDealName(event.target.value,)}
            />

            {errors.dealName && (
              <span className={styles.errorText}>
                {errors.dealName}
              </span>
            )}
          </label>

          <label>
            Giá trị Deal *
            <input type="number" min="1" step="0.01"
              value={dealValue}
              onChange={(event) => setDealValue(event.target.value,)}
            />

            {errors.dealValue && (
              <span className={styles.errorText}>
                {errors.dealValue}
              </span>
            )}
          </label>

          <label>
            Giai đoạn Pipeline *
            <select value={stageId}
              onChange={(event) => setStageId(event.target.value,)}
            >
              <option value="">
                -- Chọn giai đoạn --
              </option>

              {stages.map((stage) => (
                <option key={stage.stageId} value={stage.stageId}>
                  {stage.stageName}
                </option>
              ))}
            </select>

            {errors.stageId && (
              <span className={styles.errorText}>
                {errors.stageId}
              </span>
            )}
          </label>

          <div className={styles.readonlyBox}>
            <span>Xác suất</span>
            <strong>
              {selectedStage?.probability ?? 0}
              %
            </strong>
          </div>

          <div className={styles.readonlyBox}>
            <span>Doanh thu kỳ vọng</span>
            <strong>
              {expectedRevenue.toLocaleString('vi-VN',)}{' '}
              đ
            </strong>
          </div>

          <label>
            Ngày dự kiến đóng
            <input
              type="date"
              min={getTodayDateString()}
              value={expectedCloseDate}
              onChange={(event) => setExpectedCloseDate(event.target.value)}
            />

            {errors.expectedCloseDate && (
              <span className={styles.errorText}>
                {errors.expectedCloseDate}
              </span>
            )}
          </label>

          {submitError && (
            <p className={styles.submitError}>
              {submitError}
            </p>
          )}

          <div className={styles.modalActions}>
            <button type="button"
              className={styles.secondaryButton}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </button>

            <button type="submit"
              className={styles.primaryButton}
              disabled={isSubmitting || (requireAssignee && salesUsers.length === 0)}
            >
              {isSubmitting ? 'Đang lưu...' : 'Tạo Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}