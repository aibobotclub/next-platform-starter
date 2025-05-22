// hooks/useAppkitPay.ts
'use client';

import { useState } from 'react';
import { usePay } from '@reown/appkit-pay/react';
import { useAccount } from 'wagmi';
import { supabase } from '@/lib/supabase';

export interface UseAppkitPayOptions {
  amount: number;
  useRebuyFund?: boolean;
  rebuyAmount?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function useAppkitPay({ amount, useRebuyFund = false, rebuyAmount: rebuyAmountParam, onSuccess, onError }: UseAppkitPayOptions) {
  const { address, isConnected } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  // 只用 OP 链 USDT
  const defaultAsset = {
    network: 'eip155:10' as `eip155:${string}`,
    asset: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
    metadata: {
      symbol: 'USDT',
      decimals: 6,
      icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
      name: 'Tether USD',
    },
  };

  // 收款地址始终用环境变量
  const recipient = process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS!;

  // 复投金支付方法，先查 user_id，再查/扣 user_balance
  const payWithRebuyFund = async (rebuyAmount: number) => {
    if (!address) throw new Error('Wallet address is missing');
    // 1. 用钱包地址查 user_id（字段 wallet_address）
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('wallet_address', address as string)
      .single();
    if (userError || !userData) throw new Error('User not found');
    const userId = userData.id;
    // 2. 用 user_id 查 credit_balance
    const { data: balanceData, error: balanceError } = await supabase
      .from('user_balance')
      .select('credit_balance')
      .eq('user_id', userId)
      .single();
    if (balanceError || !balanceData) throw new Error('Balance not found');
    const creditBalance = balanceData.credit_balance;
    if (creditBalance == null || creditBalance < rebuyAmount) {
      throw new Error('Insufficient repurchase fund balance');
    }
    // 3. 扣减 credit_balance
    const { error: updateError } = await supabase
      .from('user_balance')
      .update({ credit_balance: creditBalance - rebuyAmount })
      .eq('user_id', userId);
    if (updateError) throw new Error('Failed to deduct repurchase fund balance');
    return { txHash: 'rebuy_tx_hash' };
  };

  const { open: openPay, isPending: payPending } = usePay({
    onSuccess: (data: any) => {
      setTxHash(data?.txHash || '');
      setIsOpen(false);
      setIsPending(false);
      if (onSuccess) onSuccess(data);
    },
    onError: (err: any) => {
      setError(typeof err === 'string' ? err : err?.message || 'Payment failed');
      setIsPending(false);
      if (onError) onError(err);
    },
  });

  const pay = async () => {
    setError(null);
    if (!isConnected || !address) {
      setError('Please connect your wallet first');
      return;
    }
    setIsOpen(true);
    setIsPending(true);
    try {
      if (useRebuyFund) {
        // 动态传入复投金金额
        const rebuyAmount = rebuyAmountParam || 25;
        await payWithRebuyFund(rebuyAmount);
        // 动态传入钱包支付金额
        await openPay({
          paymentAsset: defaultAsset,
          recipient,
          amount: amount - rebuyAmount,
        });
      } else {
        // 动态传入总金额
        await openPay({
          paymentAsset: defaultAsset,
          recipient,
          amount: amount,
        });
      }
    } catch (err: any) {
      setError(typeof err === 'string' ? err : err?.message || 'Payment failed');
      setIsPending(false);
      if (onError) onError(err);
    }
  };

  return {
    pay,
    isOpen,
    isPending: isPending || payPending,
    error,
    txHash,
    setIsOpen,
  };
}
