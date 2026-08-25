import type { Customer, } from '../../modules/customers/customers.types';
import styles from './customers-page.module.css';

interface Props {
    customer: Customer | null;
    onClose: () => void;
}

function formatDate(value: string | null,): string {
    if (!value) {
        return '-';
    }

    return new Intl.DateTimeFormat('vi-VN',
        {
            timeZone: 'Asia/Ho_Chi_Minh',
        },
    ).format(new Date(value));
}

export default function CustomerDetailModal({ customer, onClose, }: Props) {
    if (!customer) {
        return null;
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <div>
                        <h2>
                            Chi tiết Customer
                        </h2>

                        <p>
                            {customer.customerCode}
                        </p>
                    </div>

                    <button type="button" className={styles.closeButton} onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className={styles.detailGrid}>
                    <Detail label="Họ tên" value={customer.fullName} />

                    <Detail label="Công ty" value={customer.company} />

                    <Detail label="Email" value={customer.email} />

                    <Detail label="Điện thoại" value={customer.phone} />

                    <Detail label="Địa chỉ" value={customer.address} />

                    <Detail label="Loại khách hàng" value={customer.customerType} />

                    <Detail
                        label="Lead nguồn"
                        value={customer.leadId ? `LD${String(customer.leadId,).padStart(3, '0',)}` : '-'}
                    />

                    <Detail label="Ngày tạo" value={formatDate(customer.createdAt,)} />
                </div>

                <div className={styles.modalFooter}>
                    <button type="button" onClick={onClose}>
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}

function Detail({ label, value, }: { label: string; value: string | null; }) {
    return (
        <div>
            <span>{label}</span>
            <strong>{value ?? '-'}</strong>
        </div>
    );
}