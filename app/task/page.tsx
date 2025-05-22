"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { fetchTaskGroupsWithStats, fetchUserTaskStats } from "@/components/dashboard/summary/tasks/fetchTaskGroups";
import TaskProgressCard, { TaskGroup, TaskStats } from "@/components/tasks/TaskProgressCard/TaskProgressCard";

export default function TaskPage() {
  const { address } = useAccount();
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

  if (!address) return <div>Please connect your wallet</div>;
  if (loading) return <div>Loading...</div>;
  if (!stats) return null;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
      {/* 全局统计区，可扩展为动态切换 group */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 12 }}>Task Progress Overview</h2>
        {/* 可加下拉选择 group，动态切换 stat */}
      </div>
      {/* 所有 group 进度卡 */}
      {groups.map((group) => (
        <div key={group.groupId} style={{ marginBottom: 24 }}>
          <TaskProgressCard groups={[group]} stats={stats} />
        </div>
      ))}
    </div>
  );
}