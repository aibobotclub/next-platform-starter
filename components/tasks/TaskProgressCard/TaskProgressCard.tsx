import React from "react";
import TaskStat from "../TaskStat/TaskStat";
import TaskGroupCard from "../TaskGroupCard/TaskGroupCard";
import styles from "./TaskProgressCard.module.css";

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
  // 兼容TaskStat组件所需字段
  const statProps = {
    totalGroups: stats.total_task_groups,
    totalTasks: stats.total_tasks,
    completedTasks: stats.completed_tasks,
    pendingReward: 0, // 可根据业务补充
    totalReward: stats.total_reward,
    claimedRewardCount: stats.claimed_reward_count,
    totalClaimedReward: stats.total_claimed_reward,
    globalDividendCount: stats.global_dividend_count,
  };
  return (
    <div className={styles.taskProgressCard}>
      <TaskStat {...statProps} />
      {groups.slice(0, 2).map((group) => (
        <TaskGroupCard key={group.groupId} {...group} />
      ))}
      <a href="/task" style={{ color: "#6a8dff", marginTop: 12, display: "block" }}>More Task Groups &gt;</a>
    </div>
  );
} 