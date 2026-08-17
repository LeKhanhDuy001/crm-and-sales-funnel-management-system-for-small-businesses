'use client';

import { type FormEvent, useState, } from 'react';
import type { ActivityLogFilterValues, ActivityLogUser, } from '../../modules/activity-logs/activity-logs.types';
import styles from './admin-activity-logs-page.module.css';

interface Props {
  values: ActivityLogFilterValues;
  users: ActivityLogUser[];
  onChange: ( field: keyof ActivityLogFilterValues, value: string,) => void;
  onApply: () => void;
  onReset: () => void;
}

const ACTIONS = [
  ['Login', 'Đăng nhập'],
  ['Logout', 'Đăng xuất'],
  ['Create', 'Thêm mới'],
  ['Update', 'Cập nhật'],
  ['Delete', 'Xóa'],
  ['Assign', 'Phân công'],
  ['Convert', 'Chuyển đổi'],
  ['Send_Quote', 'Gửi báo giá'],
  ['Change_Stage', 'Đổi giai đoạn'],
] as const;

export default function ActivityLogFilters({values, users, onChange, onApply, onReset,}: Props) {
  const [dateError, setDateError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>,): void {
    event.preventDefault();

    if (values.fromDate && values.toDate && values.fromDate > values.toDate) {
      setDateError('Ngày bắt đầu không được sau ngày kết thúc.',);
      return;
    }
    setDateError('');
    onApply();
  }

  function handleDateChange(field: 'fromDate' | 'toDate', value: string,): void {
    onChange(field, value);
    setDateError('');
  }

  return (
    <form className={styles.filters} onSubmit={handleSubmit}>
      <div className={styles.filterField}>
        <label htmlFor="activity-user">
          Người dùng
        </label>

        <select id="activity-user" value={values.userId}
          onChange={(event) => onChange('userId', event.target.value,)}
        >
          <option value="">
            Tất cả người dùng
          </option>

          {users.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.fullName}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterField}>
        <label htmlFor="activity-action">
          Hành động
        </label>

        <select id="activity-action" value={values.action}
          onChange={(event) => onChange('action', event.target.value,)}
        >
          <option value="">
            Tất cả hành động
          </option>

          {ACTIONS.map(
            ([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ),
          )}
        </select>
      </div>

      <div className={styles.filterField}>
        <label htmlFor="from-date">
          Từ ngày
        </label>

        <input id="from-date" type="date"
          value={values.fromDate}
          className={dateError ? styles.inputError : undefined}
          onChange={(event) => handleDateChange('fromDate', event.target.value,)}
        />
      </div>

      <div className={styles.filterField}>
        <label htmlFor="to-date">
          Đến ngày
        </label>

        <input id="to-date" type="date"
          value={values.toDate}
          className={dateError ? styles.inputError : undefined}
          onChange={(event) => handleDateChange('toDate', event.target.value,)}
        />

        {dateError && (
          <span className={styles.errorText}>
            {dateError}
          </span>
        )}
      </div>

      <div className={styles.filterActions}>
        <button type="submit" className={styles.primaryButton}>
          Lọc
        </button>

        <button type="button" className={styles.secondaryButton}
          onClick={() => {setDateError(''); onReset();}}
        >
          Đặt lại
        </button>
      </div>
    </form>
  );
}