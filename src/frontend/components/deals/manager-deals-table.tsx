import type { Deal } from '../../modules/deals/deals.types';
import { getDealStageLabel } from '../../modules/deals/deal-stage-labels';
import styles from './manager-deals-table.module.css';

interface Props {
  deals: Deal[];
  onView: (deal: Deal) => void;
  onAssign: (deal: Deal) => void;
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
}

export default function ManagerDealsTable({
  deals,
  onView,
  onAssign,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã</th>
            <th>Tên Deal</th>
            <th>Customer</th>
            <th>Giai đoạn</th>
            <th>Người phụ trách</th>
            <th>Giá trị</th>
            <th>Doanh thu kỳ vọng</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {deals.map((deal) => (
            <tr key={deal.dealId}>
              <td>{deal.dealCode}</td>

              <td>
                <strong>{deal.dealName}</strong>
              </td>

              <td>
                {deal.customer.fullName}
              </td>

              <td>
                {getDealStageLabel(deal.stage.stageName,)}
              </td>

              <td>
                {deal.assignedUser.fullName}
              </td>

              <td>
                {deal.dealValue.toLocaleString('vi-VN',)}{' '}
                đ
              </td>

              <td>
                {(deal.expectedRevenue ?? 0).toLocaleString('vi-VN')}{' '}
                đ
              </td>

              <td>
                <div className={styles.actions}>
                  <button type="button" onClick={() => onView(deal)}>
                    Chi tiết
                  </button>

                  <button type="button" className={styles.assignButton} onClick={() => onAssign(deal)}>
                    Phân công
                  </button>

                  <button type="button" onClick={() => onEdit(deal)}>
                    Sửa
                  </button>

                  <button type="button" className={styles.deleteButton} onClick={() => onDelete(deal)}>
                    Xóa
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}