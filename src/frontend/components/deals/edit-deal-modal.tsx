'use client';

import { type FormEvent, useState, } from 'react';
import type { Customer } from '../../modules/customers/customers.types';
import { getTodayDateString, validateDealForm, type DealFormErrors, } from '../../modules/deals/deal-form-validation';
import { updateDeal } from '../../modules/deals/deals.service';
import type { Deal } from '../../modules/deals/deals.types';
import { ApiError } from '../../services/api';
import styles from './deals-page.module.css';
import { getDealStageLabel } from '../../modules/deals/deal-stage-labels';

interface EditDealModalProps {
  token: string;
  deal: Deal;
  customers: Customer[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditDealModal({ token, deal, customers, onClose, onSuccess, }: EditDealModalProps) {
  const [errors, setErrors] = useState<DealFormErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>,): Promise<void> {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const customerId = String(formData.get('customerId') ?? '',);

    const dealName = String(formData.get('dealName') ?? '',);

    const dealValue = String(formData.get('dealValue') ?? '',);

    const expectedCloseDate = String(formData.get('expectedCloseDate',) ?? '',);

    const validationErrors = validateDealForm({ customerId, stageId: '', dealName, dealValue, expectedCloseDate, }, false,);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError('');

      const response =
        await updateDeal(
          token,
          deal.dealId,
          {
            customerId:
              Number(customerId),
            dealName:
              dealName.trim(),
            dealValue:
              Number(dealValue),
            expectedCloseDate:
              expectedCloseDate ||
              undefined,
          },
        );

      window.alert(response.message);
      onSuccess();
    } catch (caughtError) {
      if (caughtError instanceof ApiError) {
        setSubmitError(caughtError.message,);
        return;
      }

      setSubmitError('Không thể cập nhật Deal.',);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>
            Sửa {deal.dealCode}
          </h2>

          <button type="button" className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <form noValidate className={styles.form} onSubmit={handleSubmit}>
          <label>
            Customer *
            <select name="customerId"
              defaultValue={deal.customer.customerId}
            >
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

          <label>
            Tên Deal *
            <input name="dealName" defaultValue={deal.dealName} />

            {errors.dealName && (
              <span className={styles.errorText}>
                {errors.dealName}
              </span>
            )}
          </label>

          <label>
            Giá trị Deal *
            <input name="dealValue" type="number" min="1" step="0.01"
              defaultValue={deal.dealValue}
            />

            {errors.dealValue && (
              <span className={styles.errorText}>
                {errors.dealValue}
              </span>
            )}
          </label>

          <div className={styles.readonlyBox}>
            <span>Pipeline</span>
            <strong>
              {getDealStageLabel(deal.stage.stageName)}
            </strong>
          </div>

          <div className={styles.readonlyBox}>
            <span>Xác suất</span>
            <strong>
              {deal.probability ?? 0}%
            </strong>
          </div>

          <label>
            Ngày dự kiến đóng
            <input
              name="expectedCloseDate"
              type="date"
              min={getTodayDateString()}
              defaultValue={deal.expectedCloseDate ? deal.expectedCloseDate.slice(0, 10) : ''}
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
              onClick={onClose} disabled={isSubmitting}
            >
              Hủy
            </button>

            <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}