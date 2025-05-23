'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAppkitPay } from '@/hooks/useAppkitPay';
import { supabase } from '@/lib/supabase';
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react';

interface PaymentPageProps {
  productName: string;
  productPrice: string;
  productDesc: string;
}

export default function PaymentPage({ productName, productPrice, productDesc }: PaymentPageProps) {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 验证必要参数
  useEffect(() => {
    if (!productName || !productPrice) {
      setError('Invalid product information');
    }
  }, [productName, productPrice]);

  const RECIPIENT = '0x915082634caD7872D789005EBFaaEF98f002F9E0';

  const { pay, isPending, error: payError } = useAppkitPay({
    amount: parseFloat(productPrice),
    recipient: RECIPIENT,
    onSuccess: async (data) => {
      setLoading(true);
      try {
        if (address) {
          const { error: dbError } = await supabase
            .from('orders')
            .insert([
              {
                user_address: address,
                product_name: productName,
                product_description: productDesc,
                amount: parseFloat(productPrice),
                status: 'success',
                tx_hash: data?.txHash || 'unknown',
              },
            ]);
          if (dbError) throw dbError;
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
    },
    onError: (err) => {
      setError(err);
      toast.error(err);
    },
  });

  const handlePay = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    setError(null);
    pay();
  };

  const handleBack = () => {
    router.back();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-24">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-center text-red-500 mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2">
              {error}
            </h2>
            <Button
              className="w-full mt-4"
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-24">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          {/* 返回按钮 */}
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 dark:text-gray-300 mb-6 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          {/* 产品信息 */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {productName}
              </h1>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {productPrice}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <p className="text-gray-600 dark:text-gray-300">
                {productDesc}
              </p>
            </div>

            {/* 支付按钮 */}
            <Button
              className="w-full h-12 text-lg font-semibold relative"
              onClick={handlePay}
              disabled={!isConnected || isPending || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Confirming...
                </>
              ) : isConnected ? (
                'Pay with Wallet'
              ) : (
                'Connect Wallet to Pay'
              )}
            </Button>

            {/* 错误提示 */}
            {payError && (
              <div className="text-red-500 text-sm text-center mt-2">
                {payError}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 