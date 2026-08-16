'use client';

import { type FormEvent, useState, } from 'react';
import type { UpdateUserInput, UserListItem, UserRoleOption,} from '../../modules/users/users.types';
import { hasFieldErrors, type UserFieldErrors, validateUpdateUser, } from '../../modules/users/user-form-validation';
import styles from './user-modal.module.css';

interface EditUserModalProps {
  user: UserListItem | null;
  roles: UserRoleOption[];
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (userId: number, input: UpdateUserInput,) => Promise<void>;
}

export default function EditUserModal({
  user,
  roles,
  isSaving,
  onClose,
  onSubmit,
}: EditUserModalProps) {
  const [fieldErrors, setFieldErrors] = useState<UserFieldErrors>({});

  if (!user) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>,): Promise<void> {
    event.preventDefault();

    if (!user) {
      return;
    }

    const formData = new FormData(event.currentTarget,);

    const input: UpdateUserInput = {
      fullName: String(formData.get('fullName') ?? '',),
      email: String(formData.get('email') ?? '',),
      phone: String(formData.get('phone') ?? '',),
      roleId: Number(formData.get('roleId'),),
      status: formData.get('status') === 'true',
    };

    const errors = validateUpdateUser(input);

    setFieldErrors(errors);

    if (hasFieldErrors(errors)) {
      return;
    }

    await onSubmit(user.userId, input,);
  }

  function clearFieldError(field: keyof UserFieldErrors,): void {
    setFieldErrors((current) => ({...current, [field]: undefined,}),);
  }

  return (
    <div className={styles.overlay}>
      <form className={styles.modal}
        onSubmit={(event) => {void handleSubmit(event);}}>
        <div className={styles.header}>
          <h2>Sửa người dùng</h2>

          <button type="button" className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.formGrid}>
          <label>
            Họ tên *

            <input name="fullName" defaultValue={user.fullName}
              className={fieldErrors.fullName ? styles.inputError : undefined}
              onChange={() => {clearFieldError('fullName',);}}/>

            {fieldErrors.fullName && (
              <span className={styles.errorText}>
                {fieldErrors.fullName}
              </span>
            )}
          </label>

          <label>
            Email *

            <input name="email" type="email" defaultValue={user.email}
              className={fieldErrors.email ? styles.inputError : undefined}
              onChange={() => {clearFieldError('email',);}}/>

            {fieldErrors.email && (
              <span className={styles.errorText}>
                {fieldErrors.email}
              </span>
            )}
          </label>

          <label>
            Điện thoại

            <input name="phone" defaultValue={user.phone ?? ''}
              className={fieldErrors.phone ? styles.inputError : undefined}
              onChange={() => {clearFieldError('phone',);}}/>

            {fieldErrors.phone && (
              <span className={styles.errorText}>
                {fieldErrors.phone}
              </span>
            )}
          </label>

          <label>
            Vai trò *

            <select name="roleId" defaultValue={String(user.role.roleId,)}
              className={fieldErrors.roleId ? styles.inputError : undefined}
              onChange={() => {clearFieldError('roleId',);}}>
              <option value="">
                Chọn vai trò
              </option>

              {roles.map((role) => (
                <option key={role.roleId} value={role.roleId}>
                  {role.roleName}
                </option>
              ))}
            </select>

            {fieldErrors.roleId && (
              <span className={styles.errorText}>
                {fieldErrors.roleId}
              </span>
            )}
          </label>

          <label>
            Trạng thái

            <select name="status" defaultValue={String(user.status,)}>
              <option value="true">
                Đang hoạt động
              </option>

              <option value="false">
                Đã khóa
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