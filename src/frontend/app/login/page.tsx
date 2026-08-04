'use client';

import {
  FormEvent,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import {
  getStoredUser,
  saveAuth,
} from '../../modules/auth/auth.storage';
import { login } from '../../modules/auth/auth.service';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberLogin, setRememberLogin] =
    useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  useEffect(() => {
    const user = getStoredUser();

    if (user?.role === 'Admin') {
      router.replace('/admin/dashboard');
    }
  }, [router]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    setError('');
    setIsSubmitting(true);

    try {
      const result = await login({
        email,
        password,
      });

      saveAuth(
        result.accessToken,
        result.user,
      );

      switch (result.user.role) {
        case 'Admin':
          router.replace('/admin/dashboard');
          break;

        case 'Sales Manager':
          router.replace(
            '/sales-manager/dashboard',
          );
          break;

        case 'Sales':
          router.replace('/sales/dashboard');
          break;

        case 'Marketing':
          router.replace(
            '/marketing/dashboard',
          );
          break;

        case 'Customer Care':
          router.replace(
            '/customer-care/dashboard',
          );
          break;

        default:
          router.replace('/unauthorized');
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Đã xảy ra lỗi khi đăng nhập',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.loginCard}>
        <div className={styles.logo}>
          C
        </div>

        <div className={styles.heading}>
          <h1>Đăng nhập hệ thống CRM</h1>

          <p>
            Nhập thông tin tài khoản để tiếp tục
          </p>
        </div>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <div className={styles.field}>
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="admin@crm.com"
              autoComplete="email"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">
              Mật khẩu
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className={styles.options}>
            <label className={styles.remember}>
              <input
                type="checkbox"
                checked={rememberLogin}
                onChange={(event) =>
                  setRememberLogin(
                    event.target.checked,
                  )
                }
                disabled={isSubmitting}
              />

              <span>Ghi nhớ đăng nhập</span>
            </label>

            <button
              type="button"
              className={styles.forgotPassword}
              disabled={isSubmitting}
            >
              Quên mật khẩu?
            </button>
          </div>

          {error && (
            <p
              className={styles.error}
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Đang đăng nhập...'
              : 'Đăng nhập'}
          </button>
        </form>

        <p className={styles.footer}>
          © 2026 CRM Management System
        </p>
      </section>
    </main>
  );
}