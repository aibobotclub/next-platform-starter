import styles from "./SummaryCard.module.css";
import SummaryItem from "./SummaryItem";
import { FiCheckCircle, FiDollarSign, FiAward, FiUsers } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { supabase } from '@/lib/supabase';
import { Card } from "@/components/ui/card";

interface SummaryCardProps {
  onDetail?: (type: 'tasks' | 'balance' | 'rewards' | 'referral') => void;
}

export default function SummaryCard({ onDetail }: SummaryCardProps) {
  // 真实数据state
  const { address } = useAccount();
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [tasksTotal, setTasksTotal] = useState(0);
  const [rewardBalance, setRewardBalance] = useState(0);
  const [totalReward, setTotalReward] = useState(0);
  const [referralCount, setReferralCount] = useState(0);

  // 数据库查询
  useEffect(() => {
    if (!address) return;
    // 查询任务统计
    supabase.from('user_task_stats').select('*').eq('wallet_address', address).single().then(res => {
      if (res.data) {
        setTasksCompleted(res.data.completed_tasks || 0);
        setTasksTotal(res.data.total_tasks || 0);
        setTotalReward(res.data.total_reward || 0);
      }
    });
    // 查询余额
    supabase.from('users').select('id').eq('wallet_address', address).single().then(userRes => {
      if (userRes.data && userRes.data.id) {
        supabase.from('user_balance').select('*').eq('user_id', userRes.data.id).single().then(balRes => {
          if (balRes.data) setRewardBalance(balRes.data.reward_balance || 0);
        });
        // 查询推荐人数
        supabase
          .from('referral_list_view')
          .select('referred_id')
          .eq('root_user_id', userRes.data.id)
          .eq('level', 1)
          .then(refRes => {
            setReferralCount(refRes.data ? refRes.data.length : 0);
          });
      }
    });
  }, [address]);

  return (
    <Card className={styles.summaryCard}>
      <div className={styles.summaryHeader}>Overview</div>
      <div className={styles.summaryStats}>
        <SummaryItem
          icon={<FiCheckCircle />}
          label="Tasks Completed"
          value={`${tasksCompleted} / ${tasksTotal}`}
          onDetail={() => onDetail && onDetail('tasks')}
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
          buttonType="share"
        />
      </div>
    </Card>
  );
}
