import { useRouter } from "next/navigation";
import styles from "./SummaryCard.module.css";

interface SummaryItemProps {
  title: string;
  value: number;
  total?: number;
  unit?: string;
  icon: "wallet" | "task" | "reward" | "referral";
  href: string;
  onClick?: () => void;
}

export default function SummaryItem({ title, value, total, unit, icon, href, onClick }: SummaryItemProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) onClick();
    else if (href && href !== "#") router.push(href);
  };

  return (
    <button className={styles.summaryItem} onClick={handleClick} tabIndex={0} aria-label={title} type="button">
      <div className={styles.itemIcon} aria-hidden>
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
    </button>
  );
}
