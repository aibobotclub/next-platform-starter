"use client";

import { useDisconnect } from '@reown/appkit/react';
import { useAppKit } from '@/hooks/useAppKit';
import { usePay } from '@reown/appkit-pay/react';
import { baseSepoliaETH } from '@reown/appkit-pay';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import styles from './PaymentView.module.css';

interface PaymentViewProps {
  amount: number;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  onClose?: () => void;
}

export function PaymentView({ amount, onSuccess, onError, onClose }: PaymentViewProps) {
  const { disconnect } = useDisconnect();
  const { openModal } = useAppKit();
  const { address } = useAppKit();
  const { open: openPay, isPending, isSuccess, data, error } = usePay({
    onSuccess: (data) => {
      console.log("Payment successful:", data);
      toast.success("Payment successful");
      onSuccess?.(data);
    },
    onError: (error) => {
      console.error("Payment error:", error);
      toast.error("Payment failed");
      onError?.(error);
    },
  });

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast.success("Wallet disconnected");
    } catch (error) {
      console.error("Failed to disconnect:", error);
      toast.error("Failed to disconnect wallet");
    }
  };

  const handlePay = async () => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      await openPay({
        paymentAsset: baseSepoliaETH,
        recipient: address,
        amount: amount
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
          <Button onClick={() => openModal()} className="unifiedButton">
            Connect Wallet
          </Button>
        ) : (
          <>
            <Button onClick={handlePay} className="unifiedButton" disabled={isPending}>
              {isPending ? "Processing..." : "Pay Now"}
            </Button>
            <Button onClick={handleDisconnect} className="unifiedButton">
              Disconnect
            </Button>
          </>
        )}
      </div>

      {(isSuccess || isPending || error) && (
        <div className={styles.statusSection}>
          <h2>Payment Status</h2>
          {isSuccess && (
            <p className={styles.successMessage}>Payment successful: {data}</p>
          )}
          {isPending && (
            <p className={styles.pendingMessage}>Payment pending: {data}</p>
          )}
          {error && (
            <p className={styles.errorMessage}>Payment error: {error}</p>
          )}
        </div>
      )}
    </div>
  );
} 