import type { Customer, CustomerPageMode, } from '../../modules/customers/customers.types';
import styles from './customers-page.module.css';

interface Props {
  customers: Customer[];
  mode: CustomerPageMode;
  onView: (customerId: number) => void;
  onEdit: (customer: Customer) => void;
}

export default function CustomersTable({customers, mode, onView, onEdit,}: Props) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã</th>
            <th>Họ tên</th>
            <th>Công ty</th>
            <th>Email</th>
            <th>Điện thoại</th>
            <th>Loại</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {customers.map(
            (customer) => (
              <tr key={customer.customerId}>
                <td>
                  {customer.customerCode}
                </td>

                <td>
                  {customer.fullName}
                </td>

                <td>
                  {customer.company ?? '-'}
                </td>

                <td>
                  {customer.email ?? '-'}
                </td>

                <td>
                  {customer.phone ?? '-'}
                </td>

                <td>
                  {customer.customerType ?? '-'}
                </td>

                <td>
                  <div className={styles.actions}>
                    <button type="button" onClick={() => onView(customer.customerId,)}>
                      Xem
                    </button>

                    <button type="button" onClick={() => onEdit(customer)}>
                      Sửa
                    </button>

                    {mode === 'sales' && (
                      <span className={styles.salesBadge}>
                        Khách hàng bán hàng
                      </span>
                    )}

                    {mode === 'customer-care' && (
                      <span className={styles.careBadge}>
                        Cần chăm sóc
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}