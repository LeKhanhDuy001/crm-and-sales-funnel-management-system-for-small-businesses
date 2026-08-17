import Link from 'next/link';
import styles from './admin-dashboard-layout.module.css';

interface AdminDashboardNavigationProps {
  activePage: | 'dashboard' | 'users' | 'products';
}

export default function AdminDashboardNavigation({ activePage, }: AdminDashboardNavigationProps) {
  return (
    <nav className={styles.navigation} aria-label="Điều hướng Admin">
      <Link href="/admin/dashboard"
        className={`${styles.navigationLink} ${activePage === 'dashboard' ? styles.navigationLinkActive : ''}`}
      >
        <span className={styles.navigationIcon} aria-hidden="true">
          ▦
        </span>
        Dashboard
      </Link>

      <Link href="/admin/users" className={`${styles.navigationLink} ${activePage === 'users' ? styles.navigationLinkActive : ''}`}
      >
        <span className={styles.navigationIcon} aria-hidden="true">
          ♟
        </span>

        Quản lý người dùng
      </Link>
      <Link href="/admin/products"
        className={`${styles.navigationLink} ${activePage === 'products' ? styles.navigationLinkActive : ''}`}
      >
        <span className={styles.navigationIcon} aria-hidden="true">
          📦
        </span>
        Sản phẩm
      </Link>
    </nav>
  );
}