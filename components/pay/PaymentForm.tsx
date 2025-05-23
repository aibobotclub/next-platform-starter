'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from 'wagmi';
import { toast } from "sonner";
import AddRecipient from "@/components/AddRecipient";
import { Button } from "@/components/ui/button";
import PaymentDialog from "@/components/pay/PaymentDialog";
import { useAppkitPay } from '@/hooks/useAppkitPay';
import { supabase } from '@/lib/supabase';

interface Product {
  name: string;
  price: string;
  desc: string;
  type: string;
}



interface PaymentFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  productName: string;
  productDescription: string;
  product?: Product;
}

export default function PaymentForm({ onClose, onSuccess, productName, productDescription, product }: PaymentFormProps) {
  // 用一个状态统一管理弹窗
  const [activeDialog, setActiveDialog] = useState<'form' | 'pay' | 'recipient'>('form');
  const { isConnected, address } = useAccount();
  const router = useRouter();

  const RECIPIENT = '0x915082634caD7872D789005EBFaaEF98f002F9E0'; // Base USDC收款地址

  const { pay, isPending, error } = useAppkitPay({
    amount: parseFloat(productDescription),
    recipient: RECIPIENT,
    onSuccess: async (data) => {
      setActiveDialog('recipient');
      onSuccess?.();
      // 记录支付成功到数据库
      if (address) {
        const { error: dbError } = await supabase
          .from('orders')
          .insert([
            {
              user_address: address,
              product_name: productName,
              product_description: productDescription,
              amount: parseFloat(productDescription),
              status: 'success',
              tx_hash: data?.txHash || 'unknown',
            },
          ]);
        if (dbError) {
          console.error('Failed to record payment:', dbError);
        }
      }
    },
    onError: (err) => {
      toast.error(err);
      setActiveDialog('form');
    },
  });

  const handlePayClick = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    setActiveDialog('pay');
    pay();
  };

  const handlePaySuccess = () => {
    setActiveDialog('recipient');
  };

  const handleRecipientClose = () => {
    setActiveDialog('form');
    if (onClose) onClose();
  };

  return (
    <>
      {/* 主支付表单弹窗 */}
      {activeDialog === 'form' && (
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
          paddingBottom: 72,
        }}>
          <div style={{
            position: 'relative',
            background: '#fff',
            borderRadius: '18px',
            width: '95vw',
            maxWidth: '480px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            padding: '24px',
            marginBottom: 72,
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
                <div style={{ fontSize: '24px', fontWeight: 600, color: '#1a1a1a' }}>{productName}</div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#2563eb' }}>{productDescription}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Button
                  style={{ height: '48px', fontSize: '16px', fontWeight: 600 }}
                  onClick={handlePayClick}
                  disabled={!isConnected || isPending}
                >
                  {isConnected ? (isPending ? 'Processing...' : 'Pay with Wallet') : 'Connect Wallet to Pay'}
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
          </div>
        </div>
      )}

      {/* 支付弹窗 */}
      <PaymentDialog
        open={activeDialog === 'pay'}
        onClose={() => setActiveDialog('form')}
        onSuccess={handlePaySuccess}
        productName={productName}
        productDescription={productDescription}
        product={product}
        zIndex={1200}
      />

      {/* 支付成功后填写收件人弹窗 */}
      <AddRecipient
        open={activeDialog === 'recipient'}
        onOpenChange={open => setActiveDialog(open ? 'recipient' : 'form')}
      />
    </>
  );
}
