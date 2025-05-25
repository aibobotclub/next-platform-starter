'use client';

import { usePay } from '@reown/appkit-pay/react';
import { baseUSDC } from '@reown/appkit-pay';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useAppKit } from '@/hooks/useAppKit';

export interface UseAppkitPayOptions {
  amount: number; // 单位：USDC
  recipient: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function useAppkitPay({
  amount,
  recipient,
  onSuccess,
  onError,
}: UseAppkitPayOptions) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const { isConnected: appkitConnected, openModal } = useAppKit();

  const { open: openPay, isPending: payPending } = usePay({
    onSuccess: (data: any) => {
      setTxHash(data?.txHash || '');
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
    if (!appkitConnected) {
      await openModal();
      setTimeout(() => {}, 300);
      return;
    }
    setIsPending(true);
    try {
      await openPay({
        paymentAsset: baseUSDC,
        recipient,
        amount
      });
    } catch (err: any) {
      setError(typeof err === 'string' ? err : err?.message || 'Payment failed');
      setIsPending(false);
      if (onError) onError(err);
    }
  };

  return {
    pay,
    isPending: isPending || payPending,
    error,
    txHash,
  };
}