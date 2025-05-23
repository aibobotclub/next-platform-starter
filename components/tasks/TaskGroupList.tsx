import { useEffect, useState } from 'react';
import TaskGroupCard from './TaskGroupCard/TaskGroupCard';
import { useRouter } from 'next/navigation';
import styles from './TaskGroupList.module.css';

export default function TaskGroupList() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // TODO: 替换为真实API或supabase查询
    fetch('/api/task-groups')
      .then(res => res.json())
      .then(data => setGroups(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.listContainer}>
      {groups.map(group => (
        <TaskGroupCard
          key={group.id}
          groupId={group.id}
          tasks={group.tasks}
          status={group.status}
          onClick={() => router.push(`/tasks/group/${group.id}`)}
          createdAt={group.created_at}
        />
      ))}
    </div>
  );
} 