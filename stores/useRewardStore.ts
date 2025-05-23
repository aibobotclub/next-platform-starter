import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface RewardStats {
  task: number;
  global: number;
  team: number;
}

interface RewardState {
  rewards: any[];
  rewardStats: RewardStats | null;
  fetchRewards: (userId: string) => Promise<void>;
  addReward: (rewardData: any) => Promise<void>;
  fetchRewardStats: (userId: string) => Promise<void>;
}

export const useRewardStore = create<RewardState>((set) => ({
  rewards: [],
  rewardStats: null,
  fetchRewards: async (userId: string) => {
    const { data, error } = await supabase
      .from('reward_details')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Failed to fetch rewards:', error);
      return;
    }

    set({ rewards: data });
  },
  addReward: async (rewardData: any) => {
    const { error } = await supabase
      .from('reward_details')
      .insert([rewardData]);

    if (error) {
      console.error('Failed to add reward:', error);
      return;
    }

    set((state) => ({
      rewards: [...state.rewards, rewardData],
    }));
  },
  fetchRewardStats: async (userId: string) => {
    // 任务奖金
    const { data: taskData } = await supabase
      .from('reward_details')
      .select('amount')
      .eq('user_id', userId)
      .eq('type', 'task');
    const task = taskData ? taskData.reduce((sum, r) => sum + (r.amount || 0), 0) : 0;

    // 全球分红
    const { data: globalData } = await supabase
      .from('global_dividend_stat')
      .select('reward_amount')
      .eq('user_id', userId);
    const global = globalData ? globalData.reduce((sum, r) => sum + (r.reward_amount || 0), 0) : 0;

    // 团队奖金
    const { data: teamData } = await supabase
      .from('team_bonus_rewards')
      .select('amount')
      .eq('user_id', userId);
    const team = teamData ? teamData.reduce((sum, r) => sum + (r.amount || 0), 0) : 0;

    set({ rewardStats: { task, global, team } });
  },
})); 