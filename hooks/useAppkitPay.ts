'use client';

import { usePay } from '@reown/appkit-pay/react';
import { useState } from 'react';
import { useAccount } from 'wagmi';

// 完整定义 bscUSDT asset，兼容 appkit pay PaymentAsset 类型
const bscUSDT = {
  chainId: 56,
  network: `eip155:56` as const,
  address: '0x55d398326f99059fF775485246999027B3197955',
  asset: '0x55d398326f99059fF775485246999027B3197955',
  symbol: 'USDT',
  decimals: 18,
  name: 'Tether USD',
  logoURI: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
  metadata: {
    name: 'Tether USD',
    symbol: 'USDT',
    decimals: 18,
  },
};

export interface UseAppkitPayOptions {
  amount: number; // 单位：USDT
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
  const { isConnected } = useAccount();

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
    if (!isConnected) {
      setError('请先连接钱包');
      setIsPending(false);
      if (onError) onError('请先连接钱包');
      return;
    }
    setIsPending(true);
    try {
      await openPay({
        paymentAsset: bscUSDT,
        recipient,
        amount,
        // @ts-ignore
        container: document.body,
        style: {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          width: '100%',
          maxWidth: '500px',
          height: 'auto',
          maxHeight: '90vh',
          overflow: 'auto'
        }
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