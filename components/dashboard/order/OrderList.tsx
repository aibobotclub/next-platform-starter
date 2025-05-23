'use client'
import styles from './OrderCenter.module.css';
import OrderStatusTag from './OrderStatusTag';
interface Props { data: any[] }
export default function OrderList({ data }: Props) {
  if (!data || data.length === 0) return <div className={styles.empty}>No orders yet</div>;
  return (
    <div className={styles.tableWrap}>
      <table className={styles.orderTable}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.amount} USDT</td>
              <td><OrderStatusTag status={item.status} /></td>
              <td>{item.payment_method || '-'}</td>
              <td>{new Date(item.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 