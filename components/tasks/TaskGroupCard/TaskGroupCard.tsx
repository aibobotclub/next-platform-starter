import React from "react";
import { Tag, Tooltip, Alert } from 'antd';
import styles from "./TaskGroupCard.module.css";

interface Task {
  id: string;
  status: string;
  reward: number;
  completed_at: string | null;
  created_at?: string | null;
  pending_at?: string | null;
}

interface TaskGroupCardProps {
  groupId: string;
  tasks: Task[];
  globalDividendId?: string | null;
  onClick?: () => void;
  createdAt?: string;
}

function getCountdown(pendingAt: string) {
  const start = new Date(pendingAt).getTime();
  const now = Date.now();
  const end = start + 48 * 3600 * 1000;
  const left = end - now;
  if (left <= 0) return 'Expired';
  const h = Math.floor(left / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);
  return `${h}h ${m}m ${s}s`;
}

export default function TaskGroupCard({ groupId, tasks, globalDividendId, onClick, status, createdAt }: TaskGroupCardProps & { status?: string }) {
  const isInactive = status === 'inactive';
  return (
    <div
      className={styles.groupCard + (isInactive ? ' ' + styles.inactive : '')}
      onClick={isInactive ? undefined : onClick}
      style={isInactive ? { opacity: 0.6, cursor: 'not-allowed', border: '1.5px solid #bbb', background: '#f8f8f8' } : {}}
    >
      <div className={styles.header}>
        <span>Group ID: {groupId}</span>
        {createdAt && <span className={styles.createdAt}>Created: {new Date(createdAt).toLocaleString()}</span>}
        {globalDividendId && (
          <span className={styles.dividend}>Global Dividend ID: {globalDividendId}</span>
        )}
        {isInactive && <Tag color="default">Inactive</Tag>}
      </div>
      {isInactive && (
        <Alert
          message="This task group is inactive. Please purchase an order to activate task rewards."
          type="warning"
          showIcon
          style={{ marginBottom: 12 }}
        />
      )}
      <div className={styles.taskList}>
        {tasks.map((task, idx) => {
          let statusNode = null;
          if (task.status === 'completed') {
            statusNode = <Tag color="green">Completed</Tag>;
          } else if (task.status === 'pending') {
            statusNode = (
              <Tooltip title={task.pending_at ? `Pending since: ${new Date(task.pending_at).toLocaleString()}` : ''}>
                <Tag color="orange">Pending{task.pending_at ? ` (${getCountdown(task.pending_at)})` : ''}</Tag>
              </Tooltip>
            );
          } else if (task.status === 'not_completed') {
            statusNode = <Tag color="red">Not Completed</Tag>;
          } else {
            statusNode = <Tag>Unstarted</Tag>;
          }
          return (
            <div key={task.id} className={styles.taskRow + ' ' + (task.completed_at ? styles.completed : '')}>
              <span>Task {idx + 1}</span>
              <span>+{task.reward}</span>
              {statusNode}
            </div>
          );
        })}
      </div>
    </div>
  );
}
