'use client';

import { usePay } from '@reown/appkit-pay/react';
import { useAppKit } from '@/hooks/useAppKit';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import styles from './PaymentView.module.css';
import { createPublicClient, http } from 'viem';
import { bsc } from 'viem/chains';

interface PaymentViewProps {
  amount: number;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  onClose?: () => void;
}

// BSC 主网 USDT 资产定义
const bscUSDT = {
  chainId: 56,
  network: `eip155:56` as const,
  address: '0x55d398326f99059fF775485246999027B3197955',
  asset: '0x55d398326f99059fF775485246999027B3197955',
  symbol: 'USDT',
  decimals: 6,
  name: 'Tether USD',
  logoURI: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
  metadata: {
    name: 'Tether USD',
    symbol: 'USDT',
    decimals: 6,
  },
};

const client = createPublicClient({
  chain: bsc,
  transport: http(),
});

export function PaymentView({ amount, onSuccess, onError, onClose }: PaymentViewProps) {
  const { openModal, address } = useAppKit();

  const { open: openPay, isPending, isSuccess, data, error } = usePay({
    onSuccess: async (data) => {
      const txHash = data?.txHash;
      toast("Waiting for blockchain confirmation...");

      try {
        const receipt = await client.waitForTransactionReceipt({ hash: txHash });
        if (receipt.status === 'success') {
          toast.success("Payment confirmed!");
          onSuccess?.(data);
        } else {
          toast.error("Transaction failed");
        }
      } catch (e) {
        console.error("Error confirming transaction:", e);
        toast.error("Failed to confirm payment");
        onError?.(e);
      }
    },
    onError: (error) => {
      console.error("Payment error:", error);
      toast.error("Payment failed");
      onError?.(error);
    },
  });

  const handlePay = async () => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      await openPay({
        paymentAsset: bscUSDT,
        recipient: address,
        amount: amount,
      });
    } catch (error) {
      console.error("Failed to open payment:", error);
      toast.error("Failed to open payment");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.buttonGroup}>
        {!address ? (
          <Button onClick={openModal} className="unifiedButton">
            Connect Wallet
          </Button>
        ) : (
          <Button onClick={handlePay} className="unifiedButton" disabled={isPending}>
            {isPending ? "Processing..." : "Pay Now"}
          </Button>
        )}
      </div>

      {(isSuccess || isPending || error) && (
        <div className={styles.statusSection}>
          <h2>Payment Status</h2>
          {isSuccess && (
            <p className={styles.successMessage}>Payment successful: {data?.txHash}</p>
          )}
          {isPending && (
            <p className={styles.pendingMessage}>Payment pending...</p>
          )}
          {error && (
            <p className={styles.errorMessage}>Payment error: {String(error)}</p>
          )}
        </div>
      )}
    </div>
  );
}