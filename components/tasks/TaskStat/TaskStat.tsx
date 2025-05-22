import React from "react";
import styles from "./TaskStat.module.css";

interface TaskStatProps {
  totalGroups: number;
  totalTasks: number;
  completedTasks: number;
  pendingReward: number;
  totalReward: number;
  claimedRewardCount?: number;
  totalClaimedReward?: number;
  globalDividendCount?: number;
}

export default function TaskStat(props: TaskStatProps) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statItem}>
        <span>Task Groups</span>
        <b>{props.totalGroups}</b>
      </div>
      <div className={styles.statItem}>
        <span>Total Tasks</span>
        <b>{props.totalTasks}</b>
      </div>
      <div className={styles.statItem}>
        <span>Completed</span>
        <b>{props.completedTasks}</b>
      </div>
      <div className={styles.statItem}>
        <span>Pending Reward</span>
        <b>{props.pendingReward}</b>
      </div>
      <div className={styles.statItem}>
        <span>Total Reward</span>
        <b>{props.totalReward}</b>
      </div>
      {props.claimedRewardCount !== undefined && (
        <div className={styles.statItem}>
          <span>Claimed Count</span>
          <b>{props.claimedRewardCount}</b>
        </div>
      )}
      {props.totalClaimedReward !== undefined && (
        <div className={styles.statItem}>
          <span>Claimed Reward</span>
          <b>{props.totalClaimedReward}</b>
        </div>
      )}
      {props.globalDividendCount !== undefined && (
        <div className={styles.statItem}>
          <span>Dividends</span>
          <b>{props.globalDividendCount}</b>
        </div>
      )}
    </div>
  );
} 