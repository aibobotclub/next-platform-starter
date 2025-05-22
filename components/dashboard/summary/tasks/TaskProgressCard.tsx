import React from "react";
import TaskStat from "@/components/tasks/TaskStat/TaskStat";
import TaskGroupCard from "@/components/tasks/TaskGroupCard/TaskGroupCard";
import styles from "./TaskProgressCard.module.css";
import Link from "next/link";

export interface Task {
  id: string;
  status: string;
  reward: number;
  completed_at: string | null;
}
export interface TaskGroup {
  groupId: string;
  tasks: Task[];
  globalDividendId?: string | null;
}
export interface TaskStats {
  total_task_groups: number;
  total_tasks: number;
  completed_tasks: number;
  total_reward: number;
  claimed_reward_count?: number;
  total_claimed_reward?: number;
  global_dividend_count?: number;
}

interface TaskProgressCardProps {
  groups?: TaskGroup[];
  stats?: TaskStats;
}

export default function TaskProgressCard({ groups = [], stats }: TaskProgressCardProps) {
  if (!stats) return null;
  const statProps = {
    totalGroups: stats.total_task_groups,
    totalTasks: stats.total_tasks,
    completedTasks: stats.completed_tasks,
    pendingReward: 0,
    totalReward: stats.total_reward,
    claimedRewardCount: stats.claimed_reward_count,
    totalClaimedReward: stats.total_claimed_reward,
    globalDividendCount: stats.global_dividend_count,
  };
  return (
    <div className={styles.taskProgressCard}>
      <div className={styles.globalStats}>
        <TaskStat {...statProps} />
      </div>
      <div className={styles.groupStatsList}>
        {groups.slice(0, 2).map((group) => (
          <div className={styles.groupStatsCard} key={group.groupId}>
            <TaskGroupCard {...group} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
        <Link href="/task" className={styles.moreBtn}>
          View More Task Groups &gt;
        </Link>
      </div>
    </div>
  );
}

export type { TaskProgressCardProps }; 