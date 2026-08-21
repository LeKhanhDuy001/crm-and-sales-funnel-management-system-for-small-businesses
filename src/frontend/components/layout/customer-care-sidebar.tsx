'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './customer-care-sidebar.module.css';

export default function CustomerCareSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2>CRM Customer Care</h2>
      </div>

      <nav className={styles.navigation}>
        <Link href="/customer-care/dashboard"
          className={pathname === '/customer-care/dashboard' ? styles.activeLink : styles.link}
        >
          <span>📊</span>
          Dashboard
        </Link>

        <Link href="/customer-care/customers"
          className={pathname.startsWith('/customer-care/customers') ? styles.activeLink : styles.link}
        >
          <span>👥</span>
          Quản lý Customer
        </Link>
        <Link href="/customer-care/tasks"
          className={pathname.startsWith('/customer-care/tasks',) ? styles.activeLink : styles.link}
        >
          <span>✅</span>
          Quản lý Task
        </Link>
        <Link href="/customer-care/notifications"
          className={pathname.startsWith('/customer-care/notifications') ? styles.activeLink : styles.link}
        >
          <span>🔔</span>
          Thông báo
        </Link>
      </nav>
    </aside>
  );
}