import styles from "./SummaryCard.module.css";
import React from "react";

interface SummaryItemProps {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
  onDetail: () => void;
}

export default function SummaryItem({ icon, label, value, onDetail }: SummaryItemProps) {
  return (
    <div className={styles.summaryItem}>
      <div className={styles.itemLeft}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <div>
          <div className={styles.label}>{label}</div>
          <div className={styles.value}>{value}</div>
        </div>
      </div>
      <button className={styles.detailBtn} onClick={onDetail}>
        Details
      </button>
    </div>
  );
}
