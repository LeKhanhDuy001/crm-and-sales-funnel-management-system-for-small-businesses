import type { ReactNode, } from 'react';
import SalesManagerSidebar from '../../components/layout/sales-manager-sidebar';
import styles from '../../components/layout/role-layout.module.css';

interface Props {
  children: ReactNode;
}

export default function SalesManagerLayout({children,}: Props) {
  return (
    <div className={styles.layout}>
      <SalesManagerSidebar />
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}