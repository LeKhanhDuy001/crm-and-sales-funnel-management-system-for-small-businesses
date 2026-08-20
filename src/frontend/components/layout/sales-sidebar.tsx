'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './sales-sidebar.module.css';

export default function SalesSidebar() {
    const pathname = usePathname();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>
                <h2>CRM Sales</h2>
            </div>

            <nav className={styles.navigation}>
                <Link href="/sales/dashboard"
                    className={pathname === '/sales/dashboard' ? styles.activeLink : styles.link}>
                    <span>📊</span>
                    Dashboard
                </Link>

                <Link
                    href="/sales/leads"
                    className={pathname.startsWith('/sales/leads') ? styles.activeLink : styles.link}>
                    <span>🎯</span>
                    Quản lý Lead
                </Link>
                <Link href="/sales/customers"
                    className={pathname.startsWith('/sales/customers') ? styles.activeLink : styles.link}
                >
                    <span>👥</span>
                    Quản lý Customer
                </Link>
                <Link href="/sales/deals"
                    className={pathname.startsWith('/sales/deals') ? styles.activeLink : styles.link}
                >
                    <span>💼</span>
                    Quản lý Deal
                </Link>
                <Link href="/sales/quotes"
                    className={pathname.startsWith('/sales/quotes') ? styles.activeLink : styles.link}
                >
                    <span>🧾</span>
                    Quản lý báo giá
                </Link>
                <Link href="/sales/tasks"
                    className={pathname.startsWith('/sales/tasks') ? styles.activeLink: styles.link}
                >
                    <span>✅</span>
                    Công việc của tôi
                </Link>
            </nav>
        </aside>
    );
}