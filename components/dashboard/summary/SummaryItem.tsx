import styles from "./SummaryCard.module.css";
import React from "react";
import { FiShare2 } from "react-icons/fi";

interface SummaryItemProps {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
  onDetail: () => void;
  buttonType?: 'details' | 'share';
}

export default function SummaryItem({ icon, label, value, onDetail, buttonType = 'details' }: SummaryItemProps) {
  return (
    <div className={styles.summaryItem}>
      <div className={styles.itemLeft}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <div>
          <div className={styles.label}>{label}</div>
          <div className={styles.value}>{value}</div>
        </div>
      </div>
      {buttonType === 'share' ? (
        <button className={styles.shareBtn} onClick={onDetail} title="Share">
          <FiShare2 />
        </button>
      ) : (
        <button className={styles.detailBtn} onClick={onDetail}>
          Details
        </button>
      )}
    </div>
  );
}
