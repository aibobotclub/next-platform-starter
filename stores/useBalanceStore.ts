import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface UserBalance {
  credit_balance: number | null;
  reward_balance: number | null;
  total_credit: number | null;
  total_rewards: number | null;
  withdrawn_amount: number | null;
  user_id: string;
  updated_at: string | null;
}

// 缓存接口
interface BalanceCache {
  data: UserBalance;
  timestamp: number;
}

// 缓存有效期（5分钟）
const CACHE_DURATION = 5 * 60 * 1000;

// 缓存存储
const balanceCache = new Map<string, BalanceCache>();

// 正在进行的请求
const pendingRequests = new Map<string, Promise<UserBalance>>();

interface BalanceState {
  balance: UserBalance | null;
  isLoading: boolean;
  error: string | null;
  fetchBalance: (address: string) => Promise<void>;
  reset: () => void;
}

export const useBalanceStore = create<BalanceState>((set) => ({
  balance: null,
  isLoading: false,
  error: null,
  fetchBalance: async (address: string) => {
    // 检查缓存
    const cached = balanceCache.get(address);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('使用缓存的余额数据');
      set({ balance: cached.data, isLoading: false, error: null });
      return;
    }

    // 检查是否有正在进行的请求
    const pendingRequest = pendingRequests.get(address);
    if (pendingRequest) {
      console.log('使用正在进行的请求');
      try {
        const data = await pendingRequest;
        set({ balance: data, isLoading: false, error: null });
        return;
      } catch (error: any) {
        set({ error: error.message || '获取用户余额失败', isLoading: false });
        return;
      }
    }

    set({ isLoading: true, error: null });

    // 创建新的请求
    const request = (async () => {
      try {
        // 1. 通过钱包地址查找 users 表，获取 id
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('wallet_address', address)
          .single();
        if (userError || !user) throw userError || new Error('用户未找到');
        
        // 2. 用 id 查 user_balance
        const { data, error } = await supabase
          .from('user_balance')
          .select('*')
          .eq('user_id', user.id)
          .single();
        if (error) throw error;

        // 更新缓存
        balanceCache.set(address, {
          data,
          timestamp: Date.now()
        });

        return data;
      } catch (error: any) {
        throw error;
      }
    })();

    // 保存请求
    pendingRequests.set(address, request);

    try {
      const data = await request;
      set({ balance: data, isLoading: false, error: null });
    } catch (error: any) {
      set({ error: error.message || '获取用户余额失败', isLoading: false });
    } finally {
      // 清理请求
      pendingRequests.delete(address);
    }
  },
  reset: () => {
    set({ balance: null, isLoading: false, error: null });
    // 清理缓存
    balanceCache.clear();
    pendingRequests.clear();
  },
}));