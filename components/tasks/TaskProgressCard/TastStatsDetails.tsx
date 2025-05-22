"use client";
import React, { useEffect, useState } from "react";
import TaskProgressCard from "./TaskProgressCard";
import { fetchTaskGroupsWithStats, fetchUserTaskStats } from "./fetchTaskGroups";
import { useAccount } from "wagmi";
import TaskStat from "../TaskStat/TaskStat";
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

export default function TaskStatsDetails() {
  const { address } = useAccount();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<TaskGroup[]>([]);
  const [stats, setStats] = useState<TaskStats | undefined>(undefined);

  useEffect(() => {
    async function loadData() {
      if (!address) {
        setError('Please connect your wallet first');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const [groupsData, statsData] = await Promise.all([
          fetchTaskGroupsWithStats(address),
          fetchUserTaskStats(address)
        ]);

        const groupList = (groupsData.groups as TaskGroup[]).map(g => ({
          groupId: g.groupId,
          globalDividendId: g.globalDividendId,
          tasks: g.tasks,
        }));

        setGroups(groupList);
        setStats(statsData);
      } catch (err) {
        console.error('Load task data failed:', err);
        setError(err instanceof Error ? err.message : 'Load task data failed');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [address]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className={styles.taskProgressCard}>
      {/* 统计数据分组 */}
      {stats && (
        <div className={styles.globalStats}>
          <TaskStat
            totalGroups={stats.total_task_groups}
            totalTasks={stats.total_tasks}
            completedTasks={stats.completed_tasks}
            pendingReward={0}
            totalReward={stats.total_reward}
            claimedRewardCount={stats.claimed_reward_count}
            totalClaimedReward={stats.total_claimed_reward}
            globalDividendCount={stats.global_dividend_count}
          />
        </div>
      )}
      {/* 最近两个任务组 */}
      <div className={styles.groupStatsList}>
        {groups.slice(0, 2).map((group) => (
          <div key={group.groupId} className={styles.groupStatsCard}>
            <TaskProgressCard groups={[group]} stats={stats} />
          </div>
        ))}
      </div>
      {/* 更多任务组跳转 */}
      <a href="/task" className={styles.moreDetailsBtn}>More Details</a>
    </div>
  );
} 