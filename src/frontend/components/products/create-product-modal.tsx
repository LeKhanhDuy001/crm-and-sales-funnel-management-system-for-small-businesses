'use client';

import { type FormEvent, useState, } from 'react';
import {
  hasProductErrors,
  mapProductServerError,
  type ProductFieldErrors,
  type ProductFormValues,
  validateProductForm,
} from '../../modules/products/product-form-validation';
import type {CreateProductInput,} from '../../modules/products/products.types';
import styles from './product-modal.module.css';

interface Props {
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (input: CreateProductInput,) => Promise<string | null>;
}

const INITIAL_VALUES: ProductFormValues = {
  productName: '',
  category: '',
  price: '',
  description: '',
  status: true,
};

export default function CreateProductModal({isOpen, isSaving, onClose, onSubmit,}: Props) {
  const [values, setValues] = useState<ProductFormValues>(INITIAL_VALUES,);

  const [fieldErrors, setFieldErrors] = useState<ProductFieldErrors>({});

  if (!isOpen) {
    return null;
  }

  function changeField(field: keyof ProductFormValues, value: string | boolean,): void {
    setValues((current) => ({...current, [field]: value,}));

    setFieldErrors((current) => ({...current, [field]: undefined, form: undefined,}));
  }

  function closeModal(): void {setValues(INITIAL_VALUES); setFieldErrors({}); onClose();}

  async function handleSubmit(event: FormEvent<HTMLFormElement>,): Promise<void> {
    event.preventDefault();

    const errors = validateProductForm(values);

    setFieldErrors(errors);

    if (hasProductErrors(errors)) {
      return;
    }

    const input: CreateProductInput = {
      productName: values.productName.trim(),
      category: values.category.trim(),
      price: Number(values.price),
      description: values.description.trim(),
      status: values.status,
    };

    const serverError = await onSubmit(input);

    if (serverError) {
      setFieldErrors(mapProductServerError(serverError,),
      );

      return;
    }

    setValues(INITIAL_VALUES);
    setFieldErrors({});
  }

  return (
    <div className={styles.overlay}>
      <form className={styles.modal} onSubmit={(event) => {void handleSubmit(event);}}>
        <div className={styles.header}>
          <h2>Thêm sản phẩm</h2>

          <button type="button" className={styles.closeButton} onClick={closeModal}>
            ×
          </button>
        </div>

        {fieldErrors.form && (
          <p className={styles.formError}>
            {fieldErrors.form}
          </p>
        )}

        <div className={styles.formGrid}>
          <label>
            Tên sản phẩm *

            <input value={values.productName}
              className={fieldErrors.productName ? styles.inputError : undefined}
              onChange={(event) => changeField('productName', event.target.value,)}
            />

            {fieldErrors.productName && (
              <span className={styles.errorText}>
                {fieldErrors.productName}
              </span>
            )}
          </label>

          <label>
            Danh mục

            <input value={values.category}
              className={fieldErrors.category ? styles.inputError : undefined}
              onChange={(event) => changeField('category', event.target.value,)}
            />

            {fieldErrors.category && (
              <span className={styles.errorText}>
                {fieldErrors.category}
              </span>
            )}
          </label>

          <label>
            Giá *

            <input type="number" min="0" step="0.01"
              value={values.price}
              className={fieldErrors.price ? styles.inputError : undefined}
              onChange={(event) => changeField('price', event.target.value,)}
            />

            {fieldErrors.price && (
              <span className={styles.errorText}>
                {fieldErrors.price}
              </span>
            )}
          </label>

          <label>
            Mô tả

            <textarea rows={4} value={values.description}
              onChange={(event) => changeField('description', event.target.value,)}
            />
          </label>

          <label>
            Trạng thái

            <select value={String(values.status)}
              onChange={(event) => changeField('status', event.target.value === 'true',)}
            >
              <option value="true">
                Đang hoạt động
              </option>

              <option value="false">
                Ngừng hoạt động
              </option>
            </select>
          </label>
        </div>

        <div className={styles.footer}>
          <button type="button" onClick={closeModal} disabled={isSaving}>
            Hủy
          </button>

          <button type="submit" disabled={isSaving}>
            {isSaving ? 'Đang lưu...' : 'Thêm sản phẩm'}
          </button>
        </div>
      </form>
    </div>
  );
}