'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Descriptions, Typography, Tag, Spin, Alert, Button, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useAppKit } from '@/hooks/useAppKit';
import styles from './TaskDetails.module.css';

const { Title } = Typography;

interface TaskGroup {
  id: number;
  user_address: string;
  order_id: number;
  task_count: number;
  created_at: string;
  updated_at: string;
  progress?: number;
  status: string;
}

interface Task {
  id: number;
  group_id: number;
  status: string;
  created_at: string;
  completed_at: string | null;
}

interface TaskDetailsProps {
  taskId?: string;
}

export default function TaskDetails({ taskId: propTaskId }: TaskDetailsProps) {
  const params = useParams();
  const router = useRouter();
  const { address } = useAppKit();
  const taskId = propTaskId || (params?.taskId as string);
  const [taskGroup, setTaskGroup] = useState<TaskGroup | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [distributing, setDistributing] = useState(false);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      if (!taskId) return;

      try {
        setLoading(true);
        setError(null);

        // 获取任务组信息
        const groupResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-task-group`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            task_group_id: taskId
          }),
        });

        if (!groupResponse.ok) {
          throw new Error('Failed to fetch task group');
        }

        const { data: groupData } = await groupResponse.json();
        setTaskGroup(groupData as TaskGroup);

        // 获取任务组中的所有任务
        const tasksResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-tasks-by-group`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            task_group_id: taskId
          }),
        });

        if (!tasksResponse.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const { data: tasksData } = await tasksResponse.json();
        setTasks(tasksData as Task[]);
      } catch (error) {
        console.error('Error fetching task details:', error);
        setError('Failed to fetch task details');
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  const handleDistributeReward = async () => {
    if (!address || !taskGroup) return;

    try {
      setDistributing(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/distribute-referral-reward`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          userAddress: address,
          orderId: taskGroup.order_id,
          amount: 20 // 20 USDT 奖励
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to distribute reward');
      }

      const result = await response.json();
      
      if (result.status === 'pending') {
        message.warning('Reward is pending. You need to create a new order within 48 hours to claim it.');
      } else {
        message.success('Reward distributed successfully!');
        // 刷新任务组信息
        const groupResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-task-group`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            task_group_id: taskId
          }),
        });

        if (groupResponse.ok) {
          const { data: groupData } = await groupResponse.json();
          setTaskGroup(groupData as TaskGroup);
        }
      }
    } catch (error) {
      console.error('Error distributing reward:', error);
      message.error('Failed to distribute reward');
    } finally {
      setDistributing(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        className={styles.alert}
      />
    );
  }

  if (!taskGroup) {
    return (
      <Alert
        message="Not Found"
        description="Task group not found"
        type="warning"
        showIcon
        className={styles.alert}
      />
    );
  }

  const isTaskGroupComplete = taskGroup.progress === taskGroup.task_count;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button 
          type="link" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.back()}
          className={styles.backButton}
        >
          Back to Task List
        </Button>
        <Title level={4} className={styles.title}>Task Group Details</Title>
      </div>

      <Card className={styles.detailsCard}>
        <Descriptions title="Task Group Information" bordered>
          <Descriptions.Item label="Group ID" span={3}>
            {taskGroup.id}
          </Descriptions.Item>
          <Descriptions.Item label="User Address" span={3}>
            {taskGroup.user_address}
          </Descriptions.Item>
          <Descriptions.Item label="Order ID" span={3}>
            {taskGroup.order_id}
          </Descriptions.Item>
          <Descriptions.Item label="Task Count" span={3}>
            {taskGroup.task_count}
          </Descriptions.Item>
          <Descriptions.Item label="Progress" span={3}>
            {taskGroup.progress || 0} / {taskGroup.task_count}
          </Descriptions.Item>
          <Descriptions.Item label="Status" span={3}>
            <Tag color={taskGroup.status === 'active' ? 'processing' : 'success'}>
              {taskGroup.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Created At" span={3}>
            {new Date(taskGroup.created_at).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At" span={3}>
            {new Date(taskGroup.updated_at).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card className={styles.card}>
        <Descriptions title="Tasks" bordered>
          {tasks.map((task) => (
            <Descriptions.Item key={task.id} label={`Task #${task.id}`} span={3}>
              <div className={styles.taskInfo}>
                <Tag color={task.completed_at ? 'success' : 'processing'}>
                  {task.completed_at ? 'Completed' : 'In Progress'}
                </Tag>
                <span className={styles.taskTime}>
                  Created: {new Date(task.created_at).toLocaleString()}
                </span>
                {task.completed_at && (
                  <span className={styles.taskTime}>
                    Completed: {new Date(task.completed_at).toLocaleString()}
                  </span>
                )}
              </div>
            </Descriptions.Item>
          ))}
        </Descriptions>
      </Card>

      {isTaskGroupComplete && taskGroup.status === 'active' && (
        <Card className={styles.rewardCard}>
          <Button 
            type="primary" 
            onClick={handleDistributeReward}
            loading={distributing}
            block
          >
            Distribute Referral Reward
          </Button>
        </Card>
      )}
    </div>
  );
}
