import styles from './RewardCenter.module.css';
interface Props { data: any[] }
export default function TaskRewardList({ data }: Props) {
  if (!data || data.length === 0) return <div className={styles.empty}>暂无任务奖励</div>;
  return (
    <div className={styles.tableWrap}>
      <table className={styles.rewardTable}>
        <thead>
          <tr>
            <th>金额</th>
            <th>时间</th>
            <th>描述</th>
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