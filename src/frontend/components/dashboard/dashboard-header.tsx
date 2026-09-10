'use client';

import { useRouter } from 'next/navigation';
import { clearAuth, getAccessToken, } from '../../modules/auth/auth.storage';
import styles from './role-dashboard.module.css';
import { logout } from '../../modules/auth/auth.service';

interface DashboardHeaderProps { title: string; description: string; }

export default function DashboardHeader({ title, description, }: DashboardHeaderProps) {
  const router = useRouter();

  async function handleLogout(): Promise<void> {
    const accessToken = getAccessToken();

    try {
      if (accessToken) {
        await logout(accessToken);
      }
    } finally {
      clearAuth();
      router.replace('/login');
    }
  }

  return (
    <header className={styles.header}>
      <div>
        <p className={styles.eyebrow}> CRM Management System </p>

        <h1>{title}</h1>

        <p className={styles.description}>{description}</p>
      </div>

      <button type="button" className={styles.logoutButton} onClick={handleLogout}>
        Đăng xuất
      </button>
    </header>
  );
}