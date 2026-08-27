import type { Lead } from '../../modules/leads/leads.types';
import styles from './sales-leads-page.module.css';

interface SalesLeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
}

export default function SalesLeadDetailModal({ lead, onClose }: SalesLeadDetailModalProps) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h2>Thông tin Lead</h2>
            <p>
              Mã Lead: LD
              {String(lead.leadId).padStart(3, '0')}
            </p>
          </div>

          <button type="button" className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.detailGrid}>
          <div className={styles.detailItem}>
            <span>Họ tên</span>
            <strong>{lead.fullName}</strong>
          </div>

          <div className={styles.detailItem}>
            <span>Công ty</span>
            <strong>{lead.company ?? 'Chưa có'}</strong>
          </div>

          <div className={styles.detailItem}>
            <span>Email</span>
            <strong>{lead.email ?? 'Chưa có'}</strong>
          </div>

          <div className={styles.detailItem}>
            <span>Điện thoại</span>
            <strong>{lead.phone ?? 'Chưa có'}</strong>
          </div>

          <div className={styles.detailItem}>
            <span>Nguồn Lead</span>
            <strong>{lead.source?.sourceName ?? 'Không xác định'}</strong>
          </div>

          <div className={styles.detailItem}>
            <span>Nhân viên phụ trách</span>
            <strong>{lead.assignedUser?.fullName ?? 'Chưa phân công'}</strong>
          </div>

          <div className={styles.detailItem}>
            <span>Trạng thái</span>
            <strong>{lead.status ?? 'Chưa xác định'}</strong>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button type="button" className={styles.closeDetailButton} onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}