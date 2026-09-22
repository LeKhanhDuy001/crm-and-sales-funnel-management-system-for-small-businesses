'use client';

import { type FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { resetPassword } from '../../modules/auth/auth.service';
import styles from './reset-password.module.css';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token')?.trim() ?? '';

    setToken(tokenFromUrl);

    if (!tokenFromUrl) {
      setError('Liên kết đặt lại mật khẩu không hợp lệ hoặc thiếu token.');
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError('');

    const normalizedToken = token.trim();

    if (!normalizedToken) {
      setError('Liên kết đặt lại mật khẩu không hợp lệ hoặc thiếu token.');
      return;
    }

    if (
      normalizedToken.length !== 64 ||
      !/^[a-f0-9]{64}$/i.test(normalizedToken)
    ) {
      setError('Reset token không hợp lệ.');
      return;
    }

    if (!newPassword) {
      setError('Vui lòng nhập mật khẩu mới.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự.');
      return;
    }

    if (!confirmPassword) {
      setError('Vui lòng xác nhận mật khẩu.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await resetPassword({
        token: normalizedToken,
        newPassword,
        confirmPassword,
      });

      window.alert(result.message);
      router.replace('/login');
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Không thể đổi mật khẩu.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.heading}>
          <h1>Đặt lại mật khẩu</h1>
          <p>Nhập mật khẩu mới cho tài khoản</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="newPassword">Mật khẩu mới</label>

            <input
              id="newPassword"
              type="password"
              value={newPassword}
              disabled={isSubmitting}
              placeholder="Nhập mật khẩu mới"
              onChange={(event) => {
                setNewPassword(event.target.value);
                setError('');
              }}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              disabled={isSubmitting}
              placeholder="Nhập lại mật khẩu"
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                setError('');
              }}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button
            className={styles.submitButton}
            type="submit"
            disabled={isSubmitting || !token}
          >
            {isSubmitting ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
          </button>

          <button
            className={styles.backButton}
            type="button"
            disabled={isSubmitting}
            onClick={() => router.push('/login')}
          >
            Hủy và quay lại đăng nhập
          </button>
        </form>
      </section>
    </main>
  );
}