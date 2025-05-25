'use client';

import { useEffect } from 'react';
import { usePay } from '@reown/appkit-pay/react';

const RECIPIENT = '0x915082634caD7872D789005EBFaaEF98f002F9E0';

interface PaymentPageProps {
  productName: string;
  productPrice: string;
  productDesc: string;
}

export default function PaymentPage({ productName, productPrice, productDesc }: PaymentPageProps) {
  const { open } = usePay({
    onSuccess: (data) => {
      window.location.href = '/dashboard';
    },
    onError: (err) => {
      let msg = typeof err === 'string' ? err : JSON.stringify(err);
      alert('Payment failed: ' + msg);
      window.location.href = '/';
    },
  });

  useEffect(() => {
    if (!productPrice) return;
    open({
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
      // 可选：可加 productName/productDesc 作为备注
    });
  }, [open, productPrice]);

  return null;
} 