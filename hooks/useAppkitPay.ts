'use client';

import { useState } from 'react';
import { usePay } from '@reown/appkit-pay/react';
import { useAccount } from 'wagmi';
import { supabase } from '@/lib/supabase';

export interface UseAppkitPayOptions {
  amount: number; // 单位：USDT
  useRebuyFund?: boolean;
  rebuyAmount?: number; // 单位：USDT
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function useAppkitPay({
  amount,
  useRebuyFund = false,
  rebuyAmount: rebuyAmountParam,
  onSuccess,
  onError,
}: UseAppkitPayOptions) {
  const { address, isConnected } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const defaultAsset = {
    network: 'eip155:10' as const,
    asset: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
    metadata: {
      symbol: 'USDT',
      decimals: 6,
      icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
      name: 'Tether USD',
    },
  };

  const recipient = process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS!;

  const payWithRebuyFund = async (rebuyAmount: number) => {
    if (!address) throw new Error('Wallet address is missing');

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('wallet_address', address)
      .single();
    if (userError || !userData) throw new Error('User not found');
    const userId = userData.id;

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
      const decimals = defaultAsset.metadata.decimals;
      const fullAmount = amount * Math.pow(10, decimals);

      if (useRebuyFund) {
        const rebuyAmount = rebuyAmountParam ?? 25;
        const rebuyInSmallest = rebuyAmount * Math.pow(10, decimals);
        const payInSmallest = fullAmount - rebuyInSmallest;

        await payWithRebuyFund(rebuyAmount);

        await openPay({
          paymentAsset: defaultAsset,
          recipient,
          amount: payInSmallest,
        });
      } else {
        await openPay({
          paymentAsset: defaultAsset,
          recipient,
          amount: fullAmount,
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