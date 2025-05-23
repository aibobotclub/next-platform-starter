import styles from "./RewardStats.module.css";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAccount } from "wagmi";

interface RewardStatsData {
  task_reward: number;
  global_dividend_reward: number;
  team_bonus_reward: number;
  total_reward: number;
}

export default function RewardStats() {
  const { address } = useAccount();
  const [stats, setStats] = useState<RewardStatsData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    // 先查user_id
    supabase
      .from("users")
      .select("id")
      .eq("wallet_address", address.toLowerCase())
      .single()
      .then(async ({ data: user }) => {
        if (!user?.id) {
          setStats(null);
          setLoading(false);
          return;
        }
        // 查视图
        const { data: rewardData } = await supabase
          .from("user_total_rewards" as any)
          .select("task_reward, global_dividend_reward, team_bonus_reward, total_reward")
          .eq("user_id", user.id)
          .single();
        setStats(rewardData && !('error' in rewardData) ? (rewardData as RewardStatsData) : null);
        setLoading(false);
      });
  }, [address]);

  return (
    <div className={styles.statsDrawerRoot}>
      <div className={styles.drawerTitle}>Reward Overview</div>
      <div className={styles.statsGrid}>
        <StatCard
          label="Task Rewards"
          value={loading ? '--' : stats?.task_reward ?? 0}
          icon={<svg width="28" height="28" fill="none"><circle cx="14" cy="14" r="13" stroke="#6366f1" strokeWidth="2"/><path d="M9 14l3 3 6-6" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        />
        <StatCard
          label="Global Dividend"
          value={loading ? '--' : stats?.global_dividend_reward ?? 0}
          icon={<svg width="28" height="28" fill="none"><circle cx="14" cy="14" r="13" stroke="#818cf8" strokeWidth="2"/><path d="M14 9v10M9 14h10" stroke="#818cf8" strokeWidth="2" strokeLinecap="round"/></svg>}
        />
        <StatCard
          label="Team Bonus"
          value={loading ? '--' : stats?.team_bonus_reward ?? 0}
          icon={<svg width="28" height="28" fill="none"><circle cx="14" cy="14" r="13" stroke="#a084ee" strokeWidth="2"/><path d="M10 18l4-8 4 8" stroke="#a084ee" strokeWidth="2" strokeLinecap="round"/></svg>}
        />
      </div>
      <div className={styles.totalSection}>
        <div className={styles.totalLabel}>Total Rewards</div>
        <div className={styles.totalValue}>{loading ? '--' : stats?.total_reward ?? 0} <span>USDT</span></div>
      </div>
      {!loading && !stats && <div className={styles.noData}>No data available</div>}
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number | string; icon: React.ReactNode }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statValue}>{value} <span className={styles.usdt}>USDT</span></div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}
