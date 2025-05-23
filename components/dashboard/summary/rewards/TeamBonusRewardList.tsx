'use client'
import styles from './RewardCenter.module.css';
interface Props { data: any[] }
export default function TeamBonusRewardList({ data }: Props) {
  if (!data || data.length === 0) return <div className={styles.empty}>No team bonus rewards yet</div>;
  return (
    <div className={styles.tableWrap}>
      <table className={styles.rewardTable}>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Time</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td className={styles.amountCell}>{item.amount} USDT</td>
              <td>{new Date(item.created_at).toLocaleString()}</td>
              <td>{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 