import { useAccount } from 'wagmi';
import { useState } from 'react';

interface ReferralData {
  isRegistered: boolean;
  referrer: string | null;
  referralPath: string[];
}

export function useReferral() {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [referralData, setReferralData] = useState<ReferralData | null>(null);

  // 获取推荐数据
  const fetchReferralData = async () => {
    if (!address) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/referral?address=${address}`);
      if (!response.ok) {
        throw new Error('Get referral data failed');
      }
      
      const data = await response.json();
      setReferralData(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  // 注册用户
  const register = async (referrerAddress?: string) => {
    if (!address) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: address,
          referrerAddress
        })
      });

      if (!response.ok) {
        throw new Error('Register failed');
      }

      // 注册成功后刷新数据
      await fetchReferralData();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    referralData,
    isLoading,
    error,
    register,
    refreshReferralData: fetchReferralData
  };
} 