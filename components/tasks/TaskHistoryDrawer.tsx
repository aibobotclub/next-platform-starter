"use client";
import { useEffect, useState } from "react";
import { useAppKit } from '@/hooks/useAppKit';
import { fetchTaskGroupsWithStats, fetchUserTaskStats } from "@/components/dashboard/summary/tasks/fetchTaskGroups";
import TaskProgressCard, { TaskGroup, TaskStats } from "@/components/tasks/TaskProgressCard/TaskProgressCard";

export default function TaskHistoryDrawer() {
  const { address } = useAppKit();
  const [groups, setGroups] = useState<TaskGroup[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);

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
      .finally(() => setLoading(false));
  }, [address]);

  if (!address) return <div style={{textAlign:'center',marginTop:48}}>Please connect your wallet</div>;
  if (loading) return <div style={{textAlign:'center',marginTop:48}}>Loading...</div>;
  if (!stats) return null;

  // 最新任务组（假设groups已按时间倒序）
  const latestGroup = groups[0];
  const historyGroups = groups.slice(1);

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
      {/* 全局统计区 */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 12 }}>Task Center</h2>
        <div style={{ color: '#bfc9ff', fontSize: 16, marginBottom: 8 }}>
          Total Groups: <b>{groups.length}</b> &nbsp;|&nbsp; Total Tasks: <b>{stats.total_tasks}</b> &nbsp;|&nbsp; Completed: <b>{stats.completed_tasks}</b>
        </div>
        <div style={{ color: '#6366f1', fontWeight: 600, fontSize: 18, marginBottom: 4 }}>
          Total Rewards: {stats.total_reward} USDT
        </div>
      </div>

      {/* 最新任务组 */}
      {latestGroup && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontWeight: 600, fontSize: 20, marginBottom: 8 }}>Latest Task Group</h3>
          <TaskProgressCard groups={[latestGroup]} stats={stats} />
        </div>
      )}

      {/* 历史任务组列表 */}
      {historyGroups.length > 0 && (
        <div>
          <h3 style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>History</h3>
          {historyGroups.map((group) => (
            <div key={group.groupId} style={{ marginBottom: 20 }}>
              <TaskProgressCard groups={[group]} stats={stats} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 