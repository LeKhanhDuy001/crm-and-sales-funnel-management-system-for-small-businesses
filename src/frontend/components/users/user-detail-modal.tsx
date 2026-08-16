import type {UserListItem,} from '../../modules/users/users.types';
import styles from './user-modal.module.css';

interface UserDetailModalProps {
  user: UserListItem | null;
  onClose: () => void;
}

function formatDate(value: string | null,): string {
  if (!value) {
    return 'Không có';
  }

  return new Intl.DateTimeFormat('vi-VN',).format(new Date(value));
}

export default function UserDetailModal({user, onClose,}: UserDetailModalProps) {
  if (!user) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Thông tin người dùng</h2>

          <button type="button" onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <div className={styles.detailGrid}>
          <p>
            <strong>Mã:</strong>{' '}
            US{String(user.userId).padStart(3, '0')}
          </p>

          <p>
            <strong>Họ tên:</strong>{' '}
            {user.fullName}
          </p>

          <p>
            <strong>Email:</strong>{' '}
            {user.email}
          </p>

          <p>
            <strong>Điện thoại:</strong>{' '}
            {user.phone ?? 'Không có'}
          </p>

          <p>
            <strong>Vai trò:</strong>{' '}
            {user.role.roleName}
          </p>

          <p>
            <strong>Trạng thái:</strong>{' '}
            {user.status ? 'Đang hoạt động' : 'Đã khóa'}
          </p>

          <p>
            <strong>Ngày tạo:</strong>{' '}
            {formatDate(user.createdAt)}
          </p>
        </div>

        <div className={styles.footer}>
          <button type="button" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}