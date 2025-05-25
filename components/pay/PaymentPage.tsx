'use client';

import { useEffect, useState } from 'react';
import { usePay } from '@reown/appkit-pay/react';
import { useAppKit } from '@/hooks/useAppKit';
import { toast } from 'sonner';

const RECIPIENT = '0x915082634caD7872D789005EBFaaEF98f002F9E0';

interface PaymentPageProps {
  productName: string;
  productPrice: string;
  productDesc: string;
}

export default function PaymentPage({ productName, productPrice, productDesc }: PaymentPageProps) {
  const { open } = usePay({
    onSuccess: () => {
      toast.success('Payment successful!');
      window.location.href = '/dashboard';
    },
    onError: (err: any) => {
      const msg = typeof err === 'string' ? err : err?.message || 'Payment failed';
      toast.error('Payment failed: ' + msg);
      window.location.href = '/';
    },
  });

  const { openModal, isConnected, chainId } = useAppKit();
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!productPrice || started) return;

    const startPayment = async () => {
      setStarted(true);
      await openModal(); // 强制连接钱包

      await new Promise((res) => setTimeout(res, 300)); // 等待连接状态刷新

      if (!isConnected) {
        toast.error('Please connect your wallet');
        return;
      }

      if (chainId !== 56) {
        toast.error('Please switch to BSC network');
        return;
      }

      await open({
        recipient: RECIPIENT,
        amount: parseFloat(productPrice),
        paymentAsset: {
          network: 'eip155:56',
          asset: '0x55d398326f99059fF775485246999027B3197955',
          metadata: {
            name: 'Tether USD',
            symbol: 'USDT',
            decimals: 6,
          },
        },
      });
    };

    startPayment();
  }, [productPrice, open, openModal, isConnected, chainId, started]);

  return null;
}