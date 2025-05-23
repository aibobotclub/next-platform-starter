import styles from "./SummaryCard.module.css";
import SummaryItem from "./SummaryItem";
import { FiCheckCircle, FiDollarSign, FiAward, FiUsers } from "react-icons/fi";
import { useState } from "react";
import RewardStats from "./rewards/RewardStats";
import DetailDrawer from "./DetailDrawer/DetailDrawer";

interface SummaryCardProps {
  onDetail?: (type: 'tasks' | 'balance' | 'rewards' | 'referral') => void;
}

export default function SummaryCard({ onDetail }: SummaryCardProps) {
  // 示例数据
  const tasksCompleted = 1;
  const tasksTotal = 3;
  const rewardBalance = 25;
  const totalReward = 5200;
  const referralCount = 12;
  const [showRewardDrawer, setShowRewardDrawer] = useState(false);

  const handleTaskDetail = () => {
    onDetail && onDetail('tasks');
  };

  return (
    <>
    <div className={styles.summaryCard}>
      <SummaryItem
        icon={<FiCheckCircle />}
        label="Tasks Completed"
        value={`${tasksCompleted} / ${tasksTotal}`}
          onDetail={handleTaskDetail}
      />
      <div className={styles.sectionDivider} />
      <SummaryItem
        icon={<FiDollarSign />}
        label="Reward Balance"
        value={<span>{rewardBalance} <span className={styles.usdt}>USDT</span></span>}
          onDetail={() => onDetail && onDetail('balance')}
      />
      <div className={styles.sectionDivider} />
      <SummaryItem
        icon={<FiAward />}
        label="Total Reward"
        value={<span>{totalReward} <span className={styles.usdt}>USDT</span></span>}
        onDetail={() => onDetail && onDetail('rewards')}
      />
      <div className={styles.sectionDivider} />
      <SummaryItem
        icon={<FiUsers />}
        label="Referral"
        value={referralCount}
        onDetail={() => onDetail && onDetail('referral')}
      />
    </div>
    </>
  );
}
