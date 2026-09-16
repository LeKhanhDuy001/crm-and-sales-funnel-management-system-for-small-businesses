'use client';

import {
  type FormEvent,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { forgotPassword } from '../../modules/auth/auth.service';
import styles from './forgot-password.module.css';

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    setError('');

    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError('Vui lòng nhập email.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await forgotPassword({
        email: normalizedEmail,
      });

      window.alert(result.message);

      router.push('/reset-password');
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Không thể gửi yêu cầu đặt lại mật khẩu.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.heading}>
          <h1>Quên mật khẩu</h1>

          <p>
            Nhập email tài khoản của bạn
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="email">
              Email
            </label>

            <input id="email" type="email" value={email} disabled={isSubmitting} placeholder="Nhập email" onChange={(event) => {
              setEmail(event.target.value);
              setError('');
            }} />
          </div>

          {error && (
            <p className={styles.error}>
              {error}
            </p>
          )}

          <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Đang kiểm tra...' : 'Tiếp tục'}
          </button>

          <button className={styles.backButton} type="button" onClick={() => { router.push('/login'); }}>Quay lại đăng nhập</button>
        </form>
      </section>
    </main>
  );
}