import { useDisconnect } from '@reown/appkit/react';
import { useAppKit } from '@/hooks/useAppKit';
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
  const { openModal, address } = useAppKit();
  
  const { handlePayWithWallet, isPaymentInProgress } = usePayController({
    amount,
    onSuccess,
    onError
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

  if (!address) {
    return (
      <Button onClick={openModal} className={styles.payButton}>
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.buttonGroup}>
        <Button 
          onClick={handlePayWithWallet}
          disabled={isPaymentInProgress}
          className={styles.payButton}
        >
          {isPaymentInProgress ? 'Processing...' : 'Pay Now'}
        </Button>
        <Button onClick={handleDisconnect} className="unifiedButton">
          Disconnect
        </Button>
      </div>
    </div>
  );
}