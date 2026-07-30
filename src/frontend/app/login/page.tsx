'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(
        'http://localhost:3001/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }

      const storage = rememberMe ? localStorage : sessionStorage;

      storage.setItem('accessToken', data.accessToken);
      storage.setItem('user', JSON.stringify(data.user));

      router.push('/dashboard');
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Không thể kết nối đến máy chủ',
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.introduction}>
        <div className={styles.introductionContent}>
          <div className={styles.logo}>CRM</div>

          <h1>Quản lý khách hàng hiệu quả hơn</h1>

          <p>
            Theo dõi khách hàng tiềm năng, cơ hội kinh doanh, báo giá và công
            việc trên cùng một hệ thống.
          </p>

          <div className={styles.features}>
            <div className={styles.featureItem}>
              <span>✓</span>
              <p>Quản lý khách hàng tập trung</p>
            </div>

            <div className={styles.featureItem}>
              <span>✓</span>
              <p>Theo dõi cơ hội bán hàng</p>
            </div>

            <div className={styles.featureItem}>
              <span>✓</span>
              <p>Quản lý công việc và báo giá</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.loginSection}>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.heading}>
            <h2>Đăng nhập</h2>
            <p>Nhập thông tin tài khoản để truy cập hệ thống CRM.</p>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              placeholder="admin@gmail.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Mật khẩu</label>

            <div className={styles.passwordField}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              <button
                type="button"
                className={styles.showPasswordButton}
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? 'Ẩn' : 'Hiện'}
              </button>
            </div>
          </div>

          <div className={styles.options}>
            <label className={styles.remember}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />

              <span>Ghi nhớ đăng nhập</span>
            </label>

            <button type="button" className={styles.forgotPassword}>
              Quên mật khẩu?
            </button>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button
            type="submit"
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>

          <p className={styles.footerText}>
            Hệ thống quản lý quan hệ khách hàng
          </p>
        </form>
      </section>
    </main>
  );
}