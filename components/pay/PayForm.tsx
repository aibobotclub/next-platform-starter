'use client';

import { useState, useEffect } from 'react';
import { PayButton } from './PayButton';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { useAppKitAccount } from '@reown/appkit/react';

type UserBalance = Database['public']['Tables']['user_balance']['Row'];

const DEFAULT_BALANCE: UserBalance = {
  user_id: '',
  credit_balance: 0,
  reward_balance: 0,
  total_credit: 0,
  total_rewards: 0,
  withdrawn_amount: 0,
  updated_at: null
};

export const PayForm = () => {
  const [userBalance, setUserBalance] = useState<UserBalance | null>(null);
  const [useCredit, setUseCredit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address, isConnected } = useAppKitAccount();

  // Fetch user balance
  useEffect(() => {
    const fetchUserBalance = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('Please log in first');
          return;
        }
        // 查询 user_balance
        const { data, error } = await supabase
          .from('user_balance')
          .select('*')
          .eq('user_id', user.id)
          .single();
        if (error && error.code !== 'PGRST116') { // PGRST116: No rows found
          throw error;
        }
        if (!data) {
          // 没查到，自动插入一条
          const { error: insertError } = await supabase.from('user_balance').insert({
            user_id: user.id,
            credit_balance: 0,
            reward_balance: 0,
            total_credit: 0,
            total_rewards: 0,
            withdrawn_amount: 0,
            updated_at: new Date().toISOString(),
          });
          if (insertError) throw insertError;
          setUserBalance({ ...DEFAULT_BALANCE, user_id: user.id });
        } else {
          setUserBalance(data);
        }
      } catch (error) {
        console.error('Failed to fetch user balance:', error);
        setError('Failed to fetch balance, please try again later');
      }
    };
    fetchUserBalance();
  }, []);

  // Handle payment success
  const handlePaySuccess = async (data: any) => {
    try {
      // If using credit, update balance in database
      if (useCredit && userBalance && userBalance.credit_balance !== null) {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('Not logged in');
        }

        const newBalance = userBalance.credit_balance - 25;
        const { error } = await supabase
          .from('user_balance')
          .upsert({
            user_id: user.id,
            credit_balance: newBalance,
            updated_at: new Date().toISOString()
          });

        if (error) {
          throw error;
        }

        // Update local state
        setUserBalance({ ...userBalance, credit_balance: newBalance });
      }
    } catch (error) {
      console.error('Failed to update balance:', error);
      setError('Payment succeeded but failed to update balance, please contact support');
    }
  };

  // Handle payment error
  const handlePayError = (error: any) => {
    console.error('Payment failed:', error);
    setError('Payment failed, please try again later');
  };

  // Calculate payment amount
  const getPaymentAmount = () => {
    if (useCredit && userBalance && userBalance.credit_balance !== null && userBalance.credit_balance >= 25) {
      return 25; // Use credit, pay 25 USDT
    }
    return 50; // No credit, pay 50 USDT
  };

  const hasEnoughCredit = userBalance && userBalance.credit_balance !== null && userBalance.credit_balance >= 25;

  return (
    <div style={{
      maxWidth: 420,
      width: '100vw',
      margin: '0 auto',
      background: '#fff',
      borderRadius: '1.5rem',
      boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      position: 'fixed',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1102,
      padding: '2rem 1.2rem 1.5rem 1.2rem',
      overflowY: 'auto',
      maxHeight: '95vh',
      minHeight: 220,
      display: 'flex',
      flexDirection: 'column',
      gap: '1.2rem',
    }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.8rem', textAlign: 'center' }}>支付</h2>
      {/* Error message */}
      {error && (
        <div style={{ background: '#fff0f0', color: '#ff6b6b', borderRadius: '0.5rem', padding: '0.5rem 0.8rem', textAlign: 'center', fontSize: '1rem' }}>{error}</div>
      )}
      {/* Credit option */}
      {hasEnoughCredit && (
        <div style={{ marginBottom: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }}>
            <input
              type="checkbox"
              checked={useCredit}
              onChange={(e) => setUseCredit(e.target.checked)}
              style={{ width: 18, height: 18 }}
            />
            <span>
              使用复购金（当前余额: {userBalance?.credit_balance ?? 0} USDT）
            </span>
          </label>
        </div>
      )}
      {/* Payment amount display */}
      <div style={{ fontSize: 16, color: '#666', marginBottom: 0 }}>
        支付金额: <span style={{ fontWeight: 700, fontSize: 22, color: '#23263a', marginLeft: 8 }}>{getPaymentAmount()} USDT</span>
        {useCredit && hasEnoughCredit && (
          <span style={{ fontSize: 13, color: '#888', marginLeft: 8 }}>(复购金抵扣25 USDT)</span>
        )}
      </div>
      {/* Connect wallet tip or Pay button */}
      {!isConnected ? (
        <div style={{ color: '#ff6b6b', textAlign: 'center', fontSize: 16, margin: '1rem 0' }}>请先连接钱包</div>
      ) : (
        <PayButton
          amount={getPaymentAmount()}
          onSuccess={handlePaySuccess}
          onError={handlePayError}
        />
      )}
    </div>
  );
};