import { useAccount, useContractRead } from 'wagmi';
import { useState } from 'react';
import { AIDA_REFERRAL_ABI } from '@/constants/abis';
import { AIDA_REFERRAL_ADDRESS } from '@/constants/addresses';
import { createClient } from '@supabase/supabase-js';

// 创建 Supabase 客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ReferralData {
  isRegistered: boolean;
  referrer: string | null;
  referralPath: string[];
}

export function useReferral() {
  const { address } = useAccount();
  const [error, setError] = useState<Error | null>(null);
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 查询用户注册状态
  const { data: isRegistered, isLoading: isCheckingRegistration } = useContractRead({
    abi: AIDA_REFERRAL_ABI,
    address: AIDA_REFERRAL_ADDRESS,
    functionName: 'isUserRegistered',
    args: address ? [address] : undefined,
  });

  // 查询推荐人
  const { data: referrer, isLoading: isCheckingReferrer } = useContractRead({
    abi: AIDA_REFERRAL_ABI,
    address: AIDA_REFERRAL_ADDRESS,
    functionName: 'getReferrer',
    args: address ? [address] : undefined,
  });

  // 查询推荐路径
  const { data: referralPath, isLoading: isCheckingPath } = useContractRead({
    abi: AIDA_REFERRAL_ABI,
    address: AIDA_REFERRAL_ADDRESS,
    functionName: 'getReferralPath',
    args: address ? [address] : undefined,
  });

  // 获取推荐数据
  const fetchReferralData = async () => {
    if (!address) return;
    
    try {
      setReferralData({
        isRegistered: isRegistered as boolean,
        referrer: referrer as string,
        referralPath: referralPath as string[],
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Get referral data failed'));
    }
  };

  // 注册用户
  const register = async (referrerAddress?: string) => {
    if (!address) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // 调用 Supabase Edge Function
      const { data, error: functionError } = await supabase.functions.invoke('register-user', {
        body: {
          userAddress: address,
          referrerAddress
        }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      // 注册成功后刷新数据
      await fetchReferralData();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Register failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const isDataLoading = isCheckingRegistration || isCheckingReferrer || isCheckingPath;

  return {
    referralData,
    isLoading: isLoading || isDataLoading,
    error,
    register,
    refreshReferralData: fetchReferralData
  };
} 