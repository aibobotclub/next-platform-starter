import styles from "./SummaryCard.module.css";
import SummaryItem from "./SummaryItem";
import { useState, useEffect } from "react";
import { useAppKit } from '@/hooks/useAppKit';
import { supabase } from '@/lib/supabase';
import { Card } from "@/components/ui/card";

interface SummaryCardProps {
  onDetail?: (type: 'tasks' | 'balance' | 'rewards' | 'referral') => void;
}

export default function SummaryCard({ onDetail }: SummaryCardProps) {
  const { address } = useAppKit();
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [tasksTotal, setTasksTotal] = useState(0);
  const [rewardBalance, setRewardBalance] = useState(0);
  const [totalReward, setTotalReward] = useState(0);
  const [referralCount, setReferralCount] = useState(0);

  useEffect(() => {
    if (!address) return;
    supabase.from('user_task_stats').select('*').eq('wallet_address', address).single().then(res => {
      if (res.data) {
        setTasksCompleted(res.data.completed_tasks || 0);
        setTasksTotal(res.data.total_tasks || 0);
        setTotalReward(res.data.total_reward || 0);
      }
    });
    supabase.from('users').select('id').eq('wallet_address', address).single().then(userRes => {
      if (userRes.data && userRes.data.id) {
        supabase.from('user_balance').select('*').eq('user_id', userRes.data.id).single().then(balRes => {
          if (balRes.data) setRewardBalance(balRes.data.reward_balance || 0);
        });
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
          icon="task"
          title="Tasks Completed"
          value={tasksCompleted}
          total={tasksTotal}
          href="#"
          onClick={() => onDetail && onDetail('tasks')}
        />
        <SummaryItem
          icon="wallet"
          title="Reward Balance"
          value={rewardBalance}
          unit="USDT"
          href="#"
          onClick={() => onDetail && onDetail('balance')}
        />
        <SummaryItem
          icon="reward"
          title="Total Reward"
          value={totalReward}
          unit="USDT"
          href="#"
          onClick={() => onDetail && onDetail('rewards')}
        />
        <SummaryItem
          icon="referral"
          title="Referral"
          value={referralCount}
          href="#"
          onClick={() => onDetail && onDetail('referral')}
        />
      </div>
    </Card>
  );
}
