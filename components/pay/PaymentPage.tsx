'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAppkitPay } from '@/hooks/useAppkitPay';
import { supabase } from '@/lib/supabase';
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import styles from './PaymentPage.module.css';
import { useAppKit } from '@/hooks/useAppKit';

// 类型定义
interface PaymentPageProps {
  productName: string;
  productPrice: string;
  productDesc: string;
}

interface OrderData {
  user_address: string;
  product_name: string;
  product_description: string;
  amount: number;
  status: 'success' | 'failed';
  tx_hash: string;
  use_reinvest?: boolean;
}

// 常量
const RECIPIENT = '0x915082634caD7872D789005EBFaaEF98f002F9E0';

export default function PaymentPage({ productName, productPrice, productDesc }: PaymentPageProps) {
  // Hooks
  const router = useRouter();
  const { isConnected, address, openModal } = useAppKit();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reinvestAmount, setReinvestAmount] = useState<number>(0);
  const [useReinvest, setUseReinvest] = useState(false);
  const [checkingReinvest, setCheckingReinvest] = useState(true);

  // 验证产品信息
  useEffect(() => {
    if (!productName || !productPrice) {
      setError('Invalid product information');
    }
  }, [productName, productPrice]);

  // 检查复购金余额
  useEffect(() => {
    async function checkReinvestBalance() {
      if (!address) return;
      
      try {
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('wallet_address', address)
          .single();

        if (userError || !user) {
          setReinvestAmount(0);
          return;
        }

        const { data, error } = await supabase
          .from('user_balance')
          .select('credit_balance')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setReinvestAmount(data?.credit_balance || 0);
      } catch (err) {
        console.error('Failed to fetch reinvest amount:', err);
        setReinvestAmount(0);
      } finally {
        setCheckingReinvest(false);
      }
    }

    checkReinvestBalance();
  }, [address]);

  // 计算实际支付金额
  const originalAmount = parseFloat(productPrice);
  const finalAmount = useReinvest 
    ? Math.max(0, originalAmount - reinvestAmount)
    : originalAmount;

  // 支付处理
  const { pay, isPending, error: payError } = useAppkitPay({
    amount: finalAmount,
    recipient: RECIPIENT,
    onSuccess: handlePaymentSuccess,
    onError: handlePaymentError,
  });

  // 处理支付成功
  async function handlePaymentSuccess(data: { txHash?: string }) {
    setLoading(true);
    try {
      if (!address) throw new Error('No wallet address found');

      const orderData: OrderData = {
        user_address: address,
        product_name: productName,
        product_description: productDesc,
        amount: originalAmount,
        status: 'success',
        tx_hash: data?.txHash || 'unknown',
        use_reinvest: useReinvest
      };

      // 调用 handle-order-events 函数
      const response = await fetch('/api/functions/handle-order-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          txHash: data?.txHash,
          orderData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to trigger order events');
      }

      const { error: dbError } = await supabase
        .from('orders')
        .insert([orderData]);

      if (dbError) throw dbError;

      // 如果使用了复购金，更新用户余额
      if (useReinvest && reinvestAmount > 0) {
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('wallet_address', address)
          .single();

        if (user) {
          const { error: balanceError } = await supabase
            .from('user_balance')
            .update({ 
              credit_balance: 0 
            })
            .eq('user_id', user.id);

          if (balanceError) throw balanceError;
        }
      }

      toast.success('Payment successful!');
      router.push('/dashboard');
    } catch (err) {
      console.error('Failed to record payment:', err);
      toast.error('Payment recorded but failed to save details');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  }

  // 处理支付错误
  function handlePaymentError(err: string) {
    setError(err);
    toast.error(err);
  }

  // 处理支付按钮点击
  function handlePay() {
    if (!isConnected) {
      openModal();
      return;
    }
    setError(null);
    pay();
  }

  // 处理返回按钮点击
  function handleBack() {
    router.back();
  }

  // 渲染错误状态
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.wrapper}>
          <div className={styles.errorCard}>
            <div className={styles.errorIcon}>
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className={styles.errorTitle}>
              {error}
            </h2>
            <Button
              className={styles.errorButton}
              variant="outline"
              onClick={handleBack}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 渲染主界面
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.card}>
          {/* 美化后的返回按钮 */}
          <button
            onClick={handleBack}
            className={styles.fabBackButton}
            aria-label="Go back"
            type="button"
          >
            <ArrowLeft className={styles.fabBackIcon} />
          </button>

          {/* 复购金余额展示 */}
          <div className={styles.balanceBar}>
            <span className={styles.balanceLabel}>Credit Cash Balance：</span>
            <span className={reinvestAmount > 0 ? styles.balanceAmount : styles.balanceAmountZero}>
              {checkingReinvest ? 'Loading...' : `${reinvestAmount} USDT`}
            </span>
          </div>

          {/* 产品信息 */}
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.title}>
                {productName}
              </h1>
              <div className={styles.price}>
                {productPrice}
              </div>
            </div>

            <div className={styles.description}>
              <p className={styles.descriptionText}>
                {productDesc}
              </p>
            </div>

            {/* 复购金选项 */}
            {!checkingReinvest && reinvestAmount > 0 && (
              <div className={styles.reinvestSection}>
                <div className={styles.reinvestHeader}>
                  <h3 className={styles.reinvestTitle}>Available Credit Cash</h3>
                  <div className={styles.reinvestAmount}>{reinvestAmount} USDT</div>
                </div>
                <div className={styles.reinvestOptions}>
                  <label className={styles.reinvestOption}>
                    <input
                      type="radio"
                      checked={!useReinvest}
                      onChange={() => setUseReinvest(false)}
                    />
                    <span>Pay Full Amount ({originalAmount} USDT)</span>
                  </label>
                  <label className={styles.reinvestOption}>
                    <input
                      type="radio"
                      checked={useReinvest}
                      onChange={() => setUseReinvest(true)}
                    />
                    <span>Use Credit Cash (Pay {finalAmount} USDT)</span>
                  </label>
                </div>
              </div>
            )}

            {/* 支付按钮 */}
            <Button
              className={styles.payButton}
              onClick={handlePay}
              disabled={!isConnected || isPending || loading}
              aria-busy={isPending || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Waiting for confirmation...
                </>
              ) : isConnected ? (
                `Pay ${finalAmount} USDT`
              ) : (
                'Connect wallet to pay'
              )}
            </Button>

            {/* 错误提示 */}
            {payError && (
              <div className="text-red-500 text-sm text-center mt-2" role="alert">
                {payError}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 