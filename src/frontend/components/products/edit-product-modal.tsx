'use client';

import {type FormEvent, useState,} from 'react';
import {
  hasProductErrors,
  mapProductServerError,
  type ProductFieldErrors,
  type ProductFormValues,
  validateProductForm,
} from '../../modules/products/product-form-validation';
import type { ProductListItem, UpdateProductInput, } from '../../modules/products/products.types';
import styles from './product-modal.module.css';

interface Props {
  product: ProductListItem;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (productId: number, input: UpdateProductInput,) => Promise<string | null>;
}

export default function EditProductModal({product, isSaving, onClose, onSubmit,}: Props) {
  const [fieldErrors, setFieldErrors] = useState<ProductFieldErrors>({});

  function clearError(field: keyof ProductFieldErrors,): void {
    setFieldErrors((current) => ({...current, [field]: undefined, form: undefined,}));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>,): Promise<void> {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const values: ProductFormValues = {productName: String(formData.get('productName') ?? '',),
      category: String(formData.get('category') ?? '',),
      price: String(formData.get('price') ?? '',),
      description: String(formData.get('description') ?? '',),
      status: formData.get('status') === 'true',
    };

    const errors = validateProductForm(values);

    setFieldErrors(errors);

    if (hasProductErrors(errors)) {
      return;
    }

    const input: UpdateProductInput = {
      productName: values.productName.trim(),
      category: values.category.trim(),
      price: Number(values.price),
      description: values.description.trim(),
      status: values.status,
    };

    const serverError = await onSubmit(product.productId, input,);

    if (serverError) {
      setFieldErrors(mapProductServerError(serverError,),);
    }
  }

  return (
    <div className={styles.overlay}>
      <form className={styles.modal}
        onSubmit={(event) => {void handleSubmit(event);}}
      >
        <div className={styles.header}>
          <h2>Sửa sản phẩm</h2>

          <button type="button" className={styles.closeButton} onClick={onClose}>
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

            <input name="productName"
              defaultValue={product.productName}
              className={fieldErrors.productName ? styles.inputError : undefined}
              onChange={() => clearError('productName',)}
            />

            {fieldErrors.productName && (
              <span className={styles.errorText}>
                {fieldErrors.productName}
              </span>
            )}
          </label>

          <label>
            Danh mục

            <input name="category"
              defaultValue={product.category ?? ''}
              className={fieldErrors.category ? styles.inputError : undefined}
              onChange={() => clearError('category')}
            />

            {fieldErrors.category && (
              <span className={styles.errorText}>
                {fieldErrors.category}
              </span>
            )}
          </label>

          <label>
            Giá *

            <input name="price" type="number" step="0.01"
              defaultValue={product.price ?? ''}
              className={fieldErrors.price ? styles.inputError : undefined}
              onChange={() => clearError('price')}
            />

            {fieldErrors.price && (
              <span className={styles.errorText}>
                {fieldErrors.price}
              </span>
            )}
          </label>

          <label>
            Mô tả

            <textarea name="description" rows={4}
              defaultValue={product.description ?? ''}
            />
          </label>

          <label>
            Trạng thái

            <select name="status" defaultValue={String(product.status,)}>
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
          <button type="button" onClick={onClose} disabled={isSaving}>
            Hủy
          </button>

          <button type="submit" disabled={isSaving}>
            {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </div>
  );
}