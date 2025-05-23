import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from 'wagmi';
import { toast } from "sonner";
import styles from "./ProductDetailModal.module.css";
import AddRecipient from "@/components/AddRecipient";
import { Button } from "@/components/ui/button";
import PaymentDialog from "@/components/pay/PaymentDialog";
import { supabase } from '@/lib/supabase';

interface Product {
  name: string;
  price: string;
  desc: string;
  type: string;
}

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const [showPay, setShowPay] = useState(false);
  const [showRecipient, setShowRecipient] = useState(false);
  const { isConnected, address } = useAccount();
  const router = useRouter();
  const [reinvestAmount, setReinvestAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showPay) {
      setShowRecipient(false);
    }
  }, [showPay]);

  useEffect(() => {
    const fetchReinvestAmount = async () => {
      if (!address) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_balance')
          .select('credit_balance')
          .eq('user_address', address)
          .single();
        if (error) throw error;
        setReinvestAmount(data?.credit_balance || 0);
      } catch (err) {
        console.error('Failed to fetch reinvest amount:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReinvestAmount();
  }, [address]);

  const handlePayClick = (useReinvest: boolean) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    setShowPay(true);
    // 这里可以根据useReinvest参数决定支付金额
    // 例如：useReinvest为true时，支付25USDT，否则支付50USDT
  };

  const handlePaySuccess = () => {
    setShowPay(false);
    setShowRecipient(true);
  };

  const handleRecipientClose = () => {
    setShowRecipient(false);
    if (onClose) onClose();
  };

  return (
    <>
      {!showPay && (
        <div className={styles.overlay} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 72,
        }}>
          <div className={styles.modal} style={{marginBottom: 72}}>
            <button className={styles.closeButton} onClick={onClose}>
              ×
            </button>
            <div className={styles.content}>
              <div className={styles.productInfo}>
                <div className={styles.productName}>{product.name}</div>
                <div className={styles.productPrice}>{product.price}</div>
                <div className={styles.productDesc}>{product.desc}</div>
              </div>
              <div className={styles.actionButtons}>
                {reinvestAmount && reinvestAmount >= 25 ? (
                  <>
                    <Button
                      className={styles.payButton}
                      onClick={() => handlePayClick(true)}
                      disabled={!isConnected || loading}
                    >
                      Pay 25 USDT + 25 USDT (Reinvest)
                    </Button>
                    <Button
                      className={styles.payButton}
                      onClick={() => handlePayClick(false)}
                      disabled={!isConnected || loading}
                    >
                      Pay 50 USDT
                    </Button>
                  </>
                ) : (
                  <Button
                    className={styles.payButton}
                    onClick={() => handlePayClick(false)}
                    disabled={!isConnected || loading}
                  >
                    {isConnected ? 'Pay with Wallet' : 'Connect Wallet to Pay'}
                  </Button>
                )}
                {!isConnected && (
                  <Button
                    variant="outline"
                    className={styles.connectButton}
                    onClick={() => router.push('/register')}
                  >
                    Register First
                  </Button>
                )}
              </div>
            </div>
            {showRecipient && (
              <AddRecipient
                open={showRecipient}
                onOpenChange={setShowRecipient}
              />
            )}
          </div>
        </div>
      )}
      <PaymentDialog
        open={showPay}
        onClose={() => setShowPay(false)}
        onSuccess={handlePaySuccess}
        productName={product.name}
        productDescription={product.price}
        product={product}
        zIndex={9999}
      />
    </>
  );
}
