import type { Deal } from '../../modules/deals/deals.types';
import styles from './deals-page.module.css';
import { getDealStageLabel } from '../../modules/deals/deal-stage-labels';

interface DealsTableProps {
  deals: Deal[];
  onView: (deal: Deal) => void;
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
  onAssign?: (deal: Deal) => void;
  showAssignedUser?: boolean;
}

function formatMoney(value: number | null,): string {
  if (value === null) {
    return 'Không có';
  }

  return new Intl.NumberFormat(
    'vi-VN',
    {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    },
  ).format(value);
}

export default function DealsTable({ deals, onView, onEdit, onDelete, onAssign, showAssignedUser = false, }: DealsTableProps) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã</th>
            <th>Tên Deal</th>
            <th>Customer</th>
            {showAssignedUser && (
              <th>Người phụ trách</th>
            )}
            <th>Giá trị</th>
            <th>Pipeline</th>
            <th>Xác suất</th>
            <th>Doanh thu kỳ vọng</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {deals.map((deal) => (
            <tr key={deal.dealId}>
              <td>{deal.dealCode}</td>
              <td>{deal.dealName}</td>

              <td>
                {deal.customer.fullName}
              </td>

              {showAssignedUser && (
                <td>
                  {deal.assignedUser.fullName}
                </td>
              )}

              <td>
                {formatMoney(
                  deal.dealValue,
                )}
              </td>

              <td>
                {getDealStageLabel(deal.stage.stageName,)}
              </td>

              <td>
                {deal.probability ?? 0}%
              </td>

              <td>
                {formatMoney(
                  deal.expectedRevenue,
                )}
              </td>

              <td>
                <div className={styles.actions}>
                  <button type="button" onClick={() => onView(deal)}>
                    Xem
                  </button>

                  <button type="button" onClick={() => onEdit(deal)}>
                    Sửa
                  </button>

                  {onAssign && (
                    <button type="button" onClick={() => onAssign(deal)}>
                      Phân công
                    </button>
                  )}

                  <button type="button" className={styles.deleteButton}
                    onClick={() => onDelete(deal)}
                  >
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