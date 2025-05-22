'use client';
import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import styles from './PaymentForm.module.css';
import { Button } from '@/components/ui/button';
import { useBalanceStore } from '@/stores/useBalanceStore';
import { usePayController } from '@/hooks/usePayController';

const OPUSDT = {
  network: 'eip155:10' as const,
  asset: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
  metadata: {
    symbol: 'USDT',
    decimals: 18,
    icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
    name: 'Tether USD',
  },
};
const RECIPIENT_ADDRESS = process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS!;

interface PaymentFormProps {
  onClose?: () => void;
  onSuccess?: () => void;
  productName?: string;
  productDescription?: string;
}

export default function PaymentForm({ onClose, onSuccess, productName = "Premium Subscription", productDescription = "Get access to all premium features" }: PaymentFormProps) {
  const { address } = useAccount();
  const { balance, isLoading, error: balanceError, fetchBalance } = useBalanceStore();
  const [useRebuy, setUseRebuy] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { handlePayWithWallet, isPaymentInProgress } = usePayController({
    amount: 50,
    useRebuyFund: useRebuy,
    onSuccess: (data) => {
      setShowReceipt(true);
      if (onSuccess) onSuccess();
    },
    onError: (err) => {
      setError(typeof err === 'string' ? err : err?.message || 'Payment failed');
    }
  });

  // 禁止页面滚动
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (address) fetchBalance(address);
  }, [address, fetchBalance]);

  // 动态计算金额
  const getAmount = () => {
    if (useRebuy && balance?.credit_balance && balance.credit_balance >= 25) return 25;
    return 50;
  };
  const hasRebuy = balance?.credit_balance && balance.credit_balance >= 25;

  const handlePay = async () => {
    setError(null);
    if (!address) return;
    await handlePayWithWallet();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <div className={styles.content}>
          <div className={styles.productInfo}>
            <div className={styles.productName}>{productName}</div>
            <div className={styles.productDescription}>{productDescription}</div>
          </div>
          {error && <div className={styles.error}>{error}</div>}
          {hasRebuy && (
            <label className={styles.rebuyLabel}>
              <input
                type="checkbox"
                checked={useRebuy}
                onChange={e => setUseRebuy(e.target.checked)}
                className={styles.rebuyCheckbox}
              />
              Use Repurchase Fund (Balance: {balance?.credit_balance ?? 0} USDT)
            </label>
          )}
          <div className={styles.priceSection}>
            <div className={styles.priceDisplay}>
              <span className={styles.currency}>USDT</span>
              <span className={styles.amount}>{getAmount()}</span>
            </div>
          </div>
          <Button
            className={styles.payButton}
            onClick={handlePay}
            disabled={isPaymentInProgress || !address}
          >
            {isPaymentInProgress ? 'Paying...' : 'Confirm Payment'}
          </Button>
        </div>
      </div>
    </div>
  );
}
