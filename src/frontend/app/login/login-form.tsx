'use client';

import { type FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { getRememberedEmail, saveAuth } from '../../modules/auth/auth.storage';
import { login } from '../../modules/auth/auth.service';
import { type LoginFieldErrors, validateLoginForm } from '../../modules/auth/login-validation';
import styles from './login.module.css';

interface LoginFormProps {
  onLoginSuccess: (role: string) => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberLogin, setRememberLogin] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const rememberedEmail = getRememberedEmail();

    if (!rememberedEmail) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setEmail(rememberedEmail);
      setRememberLogin(true);
    }, 0);

    return () => {window.clearTimeout(timeoutId);};
  }, []);

  function clearFieldError(field: keyof LoginFieldErrors): void {
    setFieldErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError('');

    const validationErrors = validateLoginForm(email, password);
    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const normalizedEmail = email.trim();

      const result = await login({
        email: normalizedEmail,
        password,
        rememberMe: rememberLogin,
      });

      saveAuth(result.accessToken, result.user, rememberLogin, normalizedEmail);
      onLoginSuccess(result.user.role);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Đã xảy ra lỗi khi đăng nhập.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.loginCard}>
        <div className={styles.heading}>
          <h1>Đăng nhập hệ thống CRM</h1>
          <p>Nhập thông tin tài khoản để tiếp tục</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              value={email}
              placeholder="admin@crm.com"
              autoComplete="email"
              disabled={isSubmitting}
              aria-invalid={fieldErrors.email ? true : undefined}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              onChange={(event) => {
                setEmail(event.target.value);
                clearFieldError('email');
              }}
            />

            {fieldErrors.email && (
              <p id="email-error" className={styles.fieldError} role="alert">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Mật khẩu</label>

            <input
              id="password"
              name="password"
              type="password"
              value={password}
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
              disabled={isSubmitting}
              aria-invalid={fieldErrors.password ? true : undefined}
              aria-describedby={fieldErrors.password ? 'password-error' : undefined}
              onChange={(event) => {
                setPassword(event.target.value);
                clearFieldError('password');
              }}
            />

            {fieldErrors.password && (
              <p id="password-error" className={styles.fieldError} role="alert">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <div className={styles.options}>
            <label className={styles.remember}>
              <input
                type="checkbox"
                checked={rememberLogin}
                disabled={isSubmitting}
                onChange={(event) => {
                  setRememberLogin(event.target.checked);
                }}
              />

              <span>Ghi nhớ đăng nhập</span>
            </label>

            <Link href="/forgot-password" className={styles.forgotPassword}>
              Quên mật khẩu?
            </Link>
          </div>

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <p className={styles.footer}>© 2026 CRM Management System</p>
      </section>
    </main>
  );
}