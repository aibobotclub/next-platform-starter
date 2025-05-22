import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchTaskGroupsWithStats(walletAddress: string) {
  // 1. 先查 users 表，拿到 user_id (uuid)
  const { data: userRows, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('wallet_address', walletAddress)
    .limit(1);

  if (userError) throw userError;
  if (!userRows || userRows.length === 0) throw new Error('未找到该钱包地址对应的用户');

  const userId = userRows[0].id;

  // 2. 再用 uuid 查任务组
  const { data: groups, error } = await supabase
    .from('user_task_groups_with_stats')
    .select('*')
    .eq('user_id', userId)
    .order('group_completed_at', { ascending: false });

  if (error) throw error;

  // 查询每个 group 的 tasks
  const { data: tasksRaw } = await supabase
    .from('tasks')
    .select('*')
    .in('group_id', groups.map((g: any) => g.group_id));
  const tasks = tasksRaw || [];

  // 组装数据
  const groupList = groups.map((g: any) => ({
    groupId: g.group_id,
    globalDividendId: g.global_dividend_id,
    tasks: tasks.filter((t: any) => t.group_id === g.group_id),
  }));

  // 统计信息
  const stats = {
    totalGroups: groups.length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t: any) => t.completed_at).length,
    pendingReward: 0, // 可根据业务补充
    totalReward: tasks.reduce((sum: number, t: any) => sum + (t.reward || 0), 0),
  };

  return { groups: groupList, stats };
}

export async function fetchUserTaskStats(walletAddress: string) {
  // 1. 先查 users 表，拿到 user_id
  const { data: userRows, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('wallet_address', walletAddress)
    .limit(1);

  if (userError) throw userError;
  if (!userRows || userRows.length === 0) throw new Error('未找到该钱包地址对应的用户');

  const userId = userRows[0].id;

  // 2. 查全局统计
  const { data: statsRows, error: statsError } = await supabase
    .from('user_task_stats')
    .select('*')
    .eq('user_id', userId)
    .limit(1);

  if (statsError) throw statsError;
  if (!statsRows || statsRows.length === 0) throw new Error('未找到该用户统计信息');

  return statsRows[0];
} 