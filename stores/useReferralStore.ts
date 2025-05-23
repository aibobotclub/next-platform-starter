import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface ReferralState {
  referrals: any[];
  fetchReferrals: (userId: string) => Promise<void>;
  addReferral: (referralData: any) => Promise<void>;
}

export const useReferralStore = create<ReferralState>((set) => ({
  referrals: [],
  fetchReferrals: async (userId: string) => {
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', userId);

    if (error) {
      console.error('Failed to fetch referrals:', error);
      return;
    }

    set({ referrals: data });
  },
  addReferral: async (referralData: any) => {
    const { error } = await supabase
      .from('referrals')
      .insert([referralData]);

    if (error) {
      console.error('Failed to add referral:', error);
      return;
    }

    set((state) => ({
      referrals: [...state.referrals, referralData],
    }));
  },
})); 