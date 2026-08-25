'use client';

import { type FormEvent, useState, } from 'react';
import { type CustomerFieldErrors, validateCustomerForm, } from '../../modules/customers/customer-form-validation';
import type { Customer, UpdateCustomerInput, } from '../../modules/customers/customers.types';
import styles from './customers-page.module.css';

interface Props {
  customer: Customer;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (customerId: number, input: UpdateCustomerInput,) => Promise<string | null>;
}

export default function EditCustomerModal({customer, isSaving, onClose, onSubmit,}: Props) {
  const [fieldErrors, setFieldErrors] = useState<CustomerFieldErrors>({});

  const [formError, setFormError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>,): Promise<void> {
    event.preventDefault();

    const formData = new FormData(event.currentTarget,);

    const input = createInput(formData);

    const errors = validateCustomerForm(input);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setFormError('');

    const errorMessage = await onSubmit(customer.customerId, input,);

    if (errorMessage) {
      setFormError(errorMessage);
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div>
            <h2>
              Cập nhật Customer
            </h2>

            <p>
              {customer.customerCode}
            </p>
          </div>

          <button type="button" className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <form noValidate onSubmit={(event) => {void handleSubmit(event);}}>
          <div className={styles.formGrid}>
            <Field label="Họ tên" name="fullName"
              defaultValue={customer.fullName}
              error={fieldErrors.fullName}
              required
            />

            <Field label="Công ty" name="company" defaultValue={customer.company ?? ''}
              error={fieldErrors.company}
            />

            <Field label="Email" name="email" type="email"
              defaultValue={customer.email ?? ''}
              error={fieldErrors.email}
            />

            <Field label="Điện thoại" name="phone"
              defaultValue={customer.phone ?? ''}
              error={fieldErrors.phone}
            />

            <Field label="Loại khách hàng" name="customerType"
              defaultValue={customer.customerType ??''}
              error={fieldErrors.customerType}
            />

            <div className={styles.fullField}>
              <label htmlFor="address">
                Địa chỉ
              </label>

              <textarea id="address" name="address"
                defaultValue={customer.address ?? ''}
              />
            </div>
          </div>

          {formError && (
            <p className={styles.formError}>
              {formError}
            </p>
          )}

          <div className={styles.modalFooter}>
            <button type="button" onClick={onClose} disabled={isSaving}>
              Hủy
            </button>

            <button type="submit" className={styles.primaryButton} disabled={isSaving}>
              {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function createInput( data: FormData,): UpdateCustomerInput {
  return {
    fullName: String(data.get('fullName') ?? '',).trim(),
    company: nullableText(data.get('company'),),
    phone: nullableText(data.get('phone'),),
    email: nullableText(data.get('email'),),
    address: nullableText(data.get('address'),),
    customerType: nullableText(data.get('customerType'),),
  };
}

function nullableText(value: FormDataEntryValue | null,): string | null {
  const text = String(value ?? '').trim();
  return text || null;
}

interface FieldProps {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
  error?: string;
  required?: boolean;
}

function Field({label, name, defaultValue, type = 'text', error, required = false,}: FieldProps) {
  return (
    <div className={styles.formField}>
      <label htmlFor={name}>
        {label}
        {required ? ' *' : ''}
      </label>

      <input id={name} name={name} type={type}
        defaultValue={defaultValue}
        className={error ? styles.inputError : undefined}
      />

      {error && (
        <span className={styles.errorText}>
          {error}
        </span>
      )}
    </div>
  );
}