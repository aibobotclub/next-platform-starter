"use client";

import React, { useState, useEffect } from 'react';
import { Layout, Typography, Tabs, Drawer, Spin, Button } from 'antd';
import { HistoryOutlined } from '@ant-design/icons';
import { useAppKit } from '@/hooks/useAppKit';
import TaskStat from './TaskStat/TaskStat';
import TaskGroupCard from './TaskGroupCard/TaskGroupCard';
import TaskDetails from './TaskDetails';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';
import styles from './TaskPage.module.css';
import TaskGroupList from './TaskGroupList';
import TaskHistoryDrawer from './TaskHistoryDrawer';

const { Content } = Layout;
const { Title } = Typography;

type Task = Database['public']['Tables']['tasks']['Row'];
type TaskGroup = Database['public']['Tables']['task_groups']['Row'];
type TaskStats = Database['public']['Views']['user_task_stats']['Row'];

interface TaskGroupWithTasks extends TaskGroup {
  tasks: Task[];
}

export default function TaskPage() {
  const { address } = useAppKit();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<TaskGroupWithTasks[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [historyDrawerVisible, setHistoryDrawerVisible] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!address) {
        setError('Please connect your wallet');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 1. 获取用户ID
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('wallet_address', address)
          .single();

        if (userError) throw userError;
        if (!userData) throw new Error('User not found');

        const userId = userData.id;

        // 2. 获取任务组和任务
        const { data: groupsData, error: groupsError } = await supabase
          .from('task_groups')
          .select(`
            *,
            tasks:tasks(*)
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (groupsError) throw groupsError;

        // 3. 获取任务统计
        const { data: statsData, error: statsError } = await supabase
          .from('user_task_stats')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (statsError) throw statsError;

        setGroups(groupsData as TaskGroupWithTasks[] || []);
        setStats(statsData);
      } catch (err) {
        console.error('Failed to load task data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load task data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [address]);

  const handleGroupClick = (groupId: string) => {
    setSelectedGroupId(groupId);
    setDrawerVisible(true);
  };

  const handleDrawerClose = () => {
    setDrawerVisible(false);
    setSelectedGroupId(null);
  };

  const handleHistoryDrawerOpen = () => setHistoryDrawerVisible(true);
  const handleHistoryDrawerClose = () => setHistoryDrawerVisible(false);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <Title level={4} className={styles.errorText}>{error}</Title>
      </div>
    );
  }

  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        <div className={styles.header} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <Title level={2} className={styles.title}>Task Center</Title>
          <Button icon={<HistoryOutlined />} onClick={handleHistoryDrawerOpen} type="default" size="large">
            Task History
          </Button>
        </div>

        {stats && (
          <div className={styles.statsSection}>
            <TaskStat
              totalGroups={stats.total_task_groups ?? 0}
              totalTasks={stats.total_tasks ?? 0}
              completedTasks={stats.completed_tasks ?? 0}
              pendingReward={0}
              totalReward={stats.total_reward ?? 0}
              claimedRewardCount={stats.claimed_reward_count ?? 0}
              totalClaimedReward={stats.total_claimed_reward ?? 0}
              globalDividendCount={stats.global_dividend_count ?? 0}
            />
          </div>
        )}

        <div className={styles.groupsSection}>
          <TaskGroupList />
        </div>

        <Drawer
        title="Task Details"
          placement="right"
          onClose={handleDrawerClose}
          open={drawerVisible}
          width={600}
          className={styles.drawer}
        >
          {selectedGroupId && (
            <TaskDetails taskId={selectedGroupId} />
          )}
        </Drawer>

        <Drawer
          title="Task History & Stats"
          placement="right"
          onClose={handleHistoryDrawerClose}
          open={historyDrawerVisible}
          width={700}
          className={styles.drawer}
        >
          <TaskHistoryDrawer />
        </Drawer>
      </Content>
    </Layout>
  );
}