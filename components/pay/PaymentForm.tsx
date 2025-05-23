'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from 'wagmi';
import { toast } from "sonner";
import AddRecipient from "@/components/AddRecipient";
import { Button } from "@/components/ui/button";
import PaymentDialog from "@/components/pay/PaymentDialog";

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
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{
          position: 'relative',
          background: '#fff',
          borderRadius: '18px',
          width: '95vw',
          maxWidth: '480px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          padding: '24px',
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              fontSize: '24px',
              background: 'none',
              border: 'none',
              color: '#666',
              cursor: 'pointer',
            }}
          >
            ×
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#1a1a1a' }}>{product.name}</div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#2563eb' }}>{product.price}</div>
              <div style={{ fontSize: '16px', color: '#666' }}>{product.desc}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Button
                style={{ height: '48px', fontSize: '16px', fontWeight: 600 }}
                onClick={handlePayClick}
                disabled={!isConnected}
              >
                {isConnected ? 'Pay with Wallet' : 'Connect Wallet to Pay'}
              </Button>
              {!isConnected && (
                <Button
                  variant="outline"
                  style={{ height: '48px', fontSize: '16px' }}
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

      <PaymentDialog
        open={showPay}
        onClose={() => setShowPay(false)}
        onSuccess={handlePaySuccess}
        productName={product.name}
        productDescription={product.desc}
      />
    </>
  );
}
