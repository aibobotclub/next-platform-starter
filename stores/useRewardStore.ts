import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface RewardState {
  rewards: any[];
  fetchRewards: (userId: string) => Promise<void>;
  addReward: (rewardData: any) => Promise<void>;
}

export const useRewardStore = create<RewardState>((set) => ({
  rewards: [],
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
})); 