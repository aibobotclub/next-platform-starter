'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from 'wagmi';
import { toast } from "sonner";
import styles from "./ProductDetailModal.module.css";
import PaymentForm from "@/components/pay/PaymentForm";
import AddRecipient from "@/components/AddRecipient";
import { Button } from "@/components/ui/button";

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

  const handlePayClick = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    setShowPay(true);
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
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <div className={styles.content}>
          <div className={styles.productInfo}>
            <div className={styles.productName}>{product.name}</div>
            <div className={styles.productPrice}>{product.price}</div>
            <div className={styles.productDesc}>{product.desc}</div>
          </div>
          
          {showPay ? (
            <PaymentForm 
              onClose={onClose} 
              onSuccess={handlePaySuccess}
              productName={product.name}
              productDescription={product.desc}
            />
          ) : (
            <div className={styles.actionButtons}>
              <Button 
                className={styles.payButton}
                onClick={handlePayClick}
                disabled={!isConnected}
              >
                {isConnected ? 'Pay with Wallet' : 'Connect Wallet to Pay'}
              </Button>
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
          )}
        </div>
        
        {showRecipient && (
          <AddRecipient 
            open={showRecipient} 
            onOpenChange={setShowRecipient}
          />
        )}
      </div>
    </div>
  );
}
