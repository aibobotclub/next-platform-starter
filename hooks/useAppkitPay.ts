'use client';

import { usePay } from '@reown/appkit-pay/react';
import { useState } from 'react';
import { useAppKit } from '@/hooks/useAppKit';

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
  const { isConnected, openModal } = useAppKit();

  const { open: openPay, isPending: payPending } = usePay({
    onSuccess: async (data: any) => {
      setTxHash(data?.txHash || '');
      setIsPending(false);
      // 支付成功后调用handle-order-events
      try {
        await fetch('/api/functions/handle-order-events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ txHash: data?.txHash }),
        });
      } catch (e) {
        // 可选：处理调用失败
        console.error('handle-order-events调用失败', e);
      }
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
      await openModal?.();
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