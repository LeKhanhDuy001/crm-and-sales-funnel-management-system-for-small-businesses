import type { ReactNode } from 'react';
import CustomerCareSidebar from '../../components/layout/customer-care-sidebar';
import styles from './customer-care-layout.module.css';

interface Props {
  children: ReactNode;
}

export default function CustomerCareLayout({children,}: Props) {
  return (
    <div className={styles.layout}>
      <CustomerCareSidebar />
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}