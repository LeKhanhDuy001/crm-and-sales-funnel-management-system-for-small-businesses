'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './role-sidebar.module.css';

export default function SalesManagerSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        CRM
      </div>

      <nav className={styles.navigation}>
        <Link href="/sales-manager/dashboard"
          className={pathname.startsWith('/sales-manager/dashboard',) ? styles.activeLink : styles.link}
        >
          <span>📊</span>
          Dashboard
        </Link>

        <Link href="/sales-manager/tasks"
          className={pathname.startsWith('/sales-manager/tasks',) ? styles.activeLink : styles.link}
        >
          <span>✅</span>
          Quản lý Task
        </Link>
        <Link href="/sales-manager/leads"
          className={pathname.startsWith('/sales-manager/leads',) ? styles.activeLink : styles.link}
        >
          <span>🎯</span>
          Quản lý Lead
        </Link>
        <Link href="/sales-manager/deals"
          className={pathname.startsWith('/sales-manager/deals',) ? styles.activeLink : styles.link}
        >
          <span>💼</span>
          Quản lý Deal
        </Link>
      </nav>
    </aside>
  );
}