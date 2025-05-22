import styles from "./BalanceCard.module.css";
import { useRouter } from "next/navigation";

export default function BalanceCard() {
  const router = useRouter();
  // Fake data, replace with real hooks or props
  const reward = 123.45;
  const shopping = 67.89;

  return (
    <div className={styles.balanceCard}>
      <div className={styles.row}>
        <div>
          <div className={styles.label}>Reward Balance</div>
          <div className={styles.value}>{reward} USDT</div>
        </div>
        <button className={styles.actionBtn} onClick={() => router.push("/order")}>Subscribe/Order</button>
      </div>
      <div className={styles.row}>
        <div>
          <div className={styles.label}>Shopping Balance</div>
          <div className={styles.value}>{shopping} USDT</div>
        </div>
      </div>
    </div>
  );
} 