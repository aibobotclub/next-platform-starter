import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type TaskGroup = Database['public']['Tables']['task_groups']['Row'];
type Task = Database['public']['Tables']['tasks']['Row'];

export async function fetchTaskGroupsWithStats(walletAddress: string) {
  if (!walletAddress) {
    throw new Error('Wallet address is required');
  }

  // 确保钱包地址格式正确
  const normalizedAddress = walletAddress.toLowerCase().trim();

  // 1. 先查 users 表，拿到 user_id
  const { data: userRows, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('wallet_address', normalizedAddress)
    .limit(1);

  if (userError) {
    console.error('查询用户失败:', userError);
    throw userError;
  }
  if (!userRows || userRows.length === 0) {
    throw new Error('User not found for the given wallet address');
  }

  const userId = userRows[0].id;

  // 2. 查任务组明细
  const { data: groups, error } = await supabase
    .from('task_groups')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });

  if (error) {
    console.error('查询任务组失败:', error);
    throw error;
  }

  // 3. 查每个 group 的 tasks
  const groupIds = groups.map((g: TaskGroup) => g.id);
  const { data: tasksRaw } = await supabase
    .from('tasks')
    .select('*')
    .in('group_id', groupIds);
  const tasks = tasksRaw || [];

  // 4. 组装数据
  const groupList = groups.map((g: TaskGroup) => ({
    groupId: g.id,
    globalDividendId: g.global_dividend_id,
    tasks: tasks.filter((t: Task) => t.group_id === g.id),
  }));

  return { groups: groupList, userId };
}

export async function fetchUserTaskStats(walletAddress: string) {
  if (!walletAddress) {
    throw new Error('钱包地址不能为空');
  }

  // 确保钱包地址格式正确
  const normalizedAddress = walletAddress.toLowerCase().trim();

  // 1. 先查 users 表，拿到 user_id
  const { data: userRows, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('wallet_address', normalizedAddress)
    .limit(1);

  if (userError) {
    console.error('查询用户失败:', userError);
    throw userError;
  }
  if (!userRows || userRows.length === 0) {
    throw new Error('未找到该钱包地址对应的用户');
  }

  const userId = userRows[0].id;

  // 2. 查用户余额和统计信息
  const { data: balanceRows, error: balanceError } = await supabase
    .from('user_balance')
    .select('*')
    .eq('user_id', userId)
    .limit(1);

  if (balanceError) {
    console.error('查询用户余额失败:', balanceError);
    throw balanceError;
  }
  if (!balanceRows || balanceRows.length === 0) {
    throw new Error('未找到该用户余额信息');
  }

  const balance = balanceRows[0];

  // 3. 查询任务统计
  const { data: taskStats, error: taskError } = await supabase
    .from('tasks')
    .select('id, status, reward')
    .eq('user_id', userId);

  if (taskError) {
    console.error('查询任务统计失败:', taskError);
    throw taskError;
  }

  const totalTasks = taskStats?.length || 0;
  const completedTasks = taskStats?.filter(t => t.status === 'completed').length || 0;
  const totalReward = taskStats?.reduce((sum, t) => sum + (t.reward || 0), 0) || 0;

  // 4. 查询任务组统计
  const { data: groupStats, error: groupError } = await supabase
    .from('task_groups')
    .select('id, global_dividend_id')
    .eq('user_id', userId);

  if (groupError) {
    console.error('查询任务组统计失败:', groupError);
    throw groupError;
  }

  const totalGroups = groupStats?.length || 0;
  const globalDividendCount = groupStats?.filter(g => g.global_dividend_id).length || 0;

  // 5. 查询已领取奖励统计
  const { data: transactionStats, error: transactionError } = await supabase
    .from('transactions')
    .select('id')
    .eq('user_id', userId)
    .eq('type', 'withdraw')
    .eq('status', 'completed');

  if (transactionError) {
    console.error('查询交易统计失败:', transactionError);
    throw transactionError;
  }

  return {
    total_task_groups: totalGroups,
    total_tasks: totalTasks,
    completed_tasks: completedTasks,
    total_reward: totalReward,
    claimed_reward_count: transactionStats?.length || 0,
    total_claimed_reward: balance.withdrawn_amount || 0,
    global_dividend_count: globalDividendCount,
  };
} 