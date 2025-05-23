import { useDisconnect, useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { usePayController } from '@/hooks/usePayController';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import styles from './PaymentView.module.css';

// OP链 USDT 配置，network 字段类型严格
const optimismUSDT = {
  network: 'eip155:10' as const, // Optimism 主网
  asset: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58', // USDT (OP)
  metadata: {
    symbol: 'USDT',
    decimals: 6,
    name: 'Tether USD',
    icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
  },
};

interface PayButtonProps {
  amount: number;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  onClose?: () => void;
}

export function PayButton({ amount, onSuccess, onError, onClose }: PayButtonProps) {
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  const { address } = useAppKitAccount();
  
  const { handlePayWithWallet, isPaymentInProgress } = usePayController({
    amount,
    useRebuyFund: false,
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
      await handlePayWithWallet();
    } catch (error) {
      console.error("Failed to open payment:", error);
      toast.error("Failed to open payment");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.buttonGroup}>
        {!address ? (
          <Button onClick={() => open()} className="unifiedButton">
            Connect Wallet
          </Button>
        ) : (
          <>
            <Button onClick={handlePay} className="unifiedButton" disabled={isPaymentInProgress}>
              {isPaymentInProgress ? "Processing..." : "Pay Now"}
            </Button>
            <Button onClick={handleDisconnect} className="unifiedButton">
              Disconnect
            </Button>
          </>
        )}
      </div>
    </div>
  );
}