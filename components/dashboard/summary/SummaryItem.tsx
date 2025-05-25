import { useRouter } from "next/navigation";
import styles from "./SummaryCard.module.css";

interface SummaryItemProps {
  title: string;
  value: number;
  total?: number;
  unit?: string;
  icon: "wallet" | "task" | "reward" | "referral";
  href: string;
}

export default function SummaryItem({ title, value, total, unit, icon, href }: SummaryItemProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(href);
  };

  return (
    <div className={styles.summaryItem} onClick={handleClick}>
      <div className={styles.itemIcon}>
        {icon === "wallet" && "💰"}
        {icon === "task" && "✅"}
        {icon === "reward" && "🎁"}
        {icon === "referral" && "👥"}
      </div>
      <div className={styles.itemContent}>
        <div className={styles.itemTitle}>{title}</div>
        <div className={styles.itemValue}>
          {total ? `${value}/${total}` : value}
          {unit && <span className={styles.itemUnit}>{unit}</span>}
        </div>
      </div>
    </div>
  );
}
