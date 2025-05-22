'use client';
import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { useBalanceStore } from '@/stores/useBalanceStore';
import { usePayController } from '@/hooks/usePayController';
import { toast } from 'sonner';
import styles from './PaymentView.module.css';

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
  const [error, setError] = useState<string | null>(null);

  const { handlePayWithWallet, isPaymentInProgress } = usePayController({
    amount: 50,
    useRebuyFund: useRebuy,
    onSuccess: (data) => {
      toast.success("Payment successful");
      if (onSuccess) onSuccess();
    },
    onError: (err) => {
      const errorMessage = typeof err === 'string' ? err : err?.message || 'Payment failed';
      toast.error(errorMessage);
      setError(errorMessage);
    }
  });

  useEffect(() => {
    if (address) fetchBalance(address);
  }, [address, fetchBalance]);

  const getAmount = () => {
    if (useRebuy && balance?.credit_balance && balance.credit_balance >= 25) return 25;
    return 50;
  };

  const hasRebuy = balance?.credit_balance && balance.credit_balance >= 25;

  const handlePay = async () => {
    setError(null);
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }
    await handlePayWithWallet();
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.productInfo}>
          <h2 className={styles.productName}>{productName}</h2>
          <p className={styles.productDescription}>{productDescription}</p>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

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

        <div className={styles.buttonGroup}>
          <Button
            className={styles.payButton}
            onClick={handlePay}
            disabled={isPaymentInProgress || !address}
          >
            {isPaymentInProgress ? 'Processing...' : 'Pay Now'}
          </Button>
          {onClose && (
            <Button
              className={styles.closeButton}
              onClick={onClose}
              variant="outline"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
