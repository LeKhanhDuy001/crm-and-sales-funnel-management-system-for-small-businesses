'use client';

import { type FormEvent, useState, } from 'react';
import type { CreateUserInput, UserRoleOption, } from '../../modules/users/users.types';
import styles from './user-modal.module.css';
import { hasFieldErrors, type UserFieldErrors, validateCreateUser,} from '../../modules/users/user-form-validation';

interface CreateUserModalProps {
  isOpen: boolean;
  roles: UserRoleOption[];
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (input: CreateUserInput,) => Promise<void>;
}

export default function CreateUserModal({ isOpen, roles, isSaving, onClose, onSubmit, }: CreateUserModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState('');
  const [fieldErrors, setFieldErrors] = useState<UserFieldErrors>({});

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>,): Promise<void> {
    event.preventDefault();

    const input: CreateUserInput = {
      fullName,
      email,
      phone,
      password,
      roleId: Number(roleId),
      status: true,
    };

    const errors = validateCreateUser(input);

    setFieldErrors(errors);

    if (hasFieldErrors(errors)) {
      return;
    }

    await onSubmit(input);
  }

  return (
    <div className={styles.overlay}>
      <form className={styles.modal}
        onSubmit={(event) => { void handleSubmit(event); }}
      >
        <div className={styles.header}>
          <h2>Thêm người dùng</h2>

          <button type="button" onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <div className={styles.formGrid}>
          <label>
            Họ tên *

            <input value={fullName}
              className={fieldErrors.fullName ? styles.inputError : undefined}
              onChange={(event) => {
                setFullName(event.target.value,);

                setFieldErrors((current) => ({ ...current, fullName: undefined, }),);
              }}
            />

            {fieldErrors.fullName && (
              <span className={styles.errorText}>
                {fieldErrors.fullName}
              </span>
            )}
          </label>

          <label>
            Email *

            <input
              type="email"
              value={email}
              className={
                fieldErrors.email
                  ? styles.inputError
                  : undefined
              }
              onChange={(event) => {
                setEmail(
                  event.target.value,
                );

                setFieldErrors(
                  (current) => ({
                    ...current,
                    email: undefined,
                  }),
                );
              }}
            />

            {fieldErrors.email && (
              <span className={styles.errorText}>
                {fieldErrors.email}
              </span>
            )}
          </label>

          <label>
            Điện thoại

            <input
              value={phone}
              className={
                fieldErrors.phone
                  ? styles.inputError
                  : undefined
              }
              onChange={(event) => {
                setPhone(
                  event.target.value,
                );

                setFieldErrors(
                  (current) => ({
                    ...current,
                    phone: undefined,
                  }),
                );
              }}
            />

            {fieldErrors.phone && (
              <span className={styles.errorText}>
                {fieldErrors.phone}
              </span>
            )}
          </label>

          <label>
            Mật khẩu *

            <input
              type="password"
              value={password}
              className={
                fieldErrors.password
                  ? styles.inputError
                  : undefined
              }
              onChange={(event) => {
                setPassword(
                  event.target.value,
                );

                setFieldErrors(
                  (current) => ({
                    ...current,
                    password: undefined,
                  }),
                );
              }}
            />

            {fieldErrors.password && (
              <span className={styles.errorText}>
                {fieldErrors.password}
              </span>
            )}
          </label>

          <label>
            Vai trò *

            <select
              value={roleId}
              className={
                fieldErrors.roleId
                  ? styles.inputError
                  : undefined
              }
              onChange={(event) => {
                setRoleId(
                  event.target.value,
                );

                setFieldErrors(
                  (current) => ({
                    ...current,
                    roleId: undefined,
                  }),
                );
              }}
            >
              <option value="">
                Chọn vai trò
              </option>

              {roles.map((role) => (
                <option
                  key={role.roleId}
                  value={role.roleId}
                >
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
        </div>

        <div className={styles.footer}>
          <button type="button" onClick={onClose} disabled={isSaving}>
            Hủy
          </button>

          <button type="submit" disabled={isSaving}>
            {isSaving ? 'Đang lưu...' : 'Thêm người dùng'}
          </button>
        </div>
      </form>
    </div>
  );
}