import React, { useEffect, useState } from "react";
import TaskProgressCard from "./TaskProgressCard";
import { fetchTaskGroupsWithStats, fetchUserTaskStats } from "./fetchTaskGroups";
import { useAccount } from "wagmi";

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

export default function TaskProgressCardContainer() {
  const { address } = useAccount();
  const [groups, setGroups] = useState<TaskGroup[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    Promise.all([
      fetchTaskGroupsWithStats(address),
      fetchUserTaskStats(address)
    ])
      .then(([groupRes, statsRes]) => {
        setGroups(groupRes.groups);
        setStats(statsRes);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [address]);

  if (!address) return <div>请先连接钱包</div>;
  if (loading) return <div>加载中...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!stats) return null;

  return <TaskProgressCard groups={groups} stats={stats} />;
} 