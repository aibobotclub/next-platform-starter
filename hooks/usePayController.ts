import { useState, useCallback } from 'react';
import { usePay } from '@reown/appkit-pay/react';
import { useAccount } from 'wagmi';
import { supabase } from '@/lib/supabase';
import type { PaymentAsset as AppkitPaymentAsset } from '@reown/appkit-pay';
import { useAppKit } from '@/hooks/useAppKit';

interface PaymentAsset {
  network: `eip155:${string}` | `eip155:${number}`;
  asset: string;
  metadata: {
    name: string;
    symbol: string;
    decimals: number;
    icon?: string;
  };
}

interface Exchange {
  id: string;
  name: string;
  imageUrl?: string;
}

interface PaymentResult {
  url: string;
  openInNewTab: boolean;
}

type PayStatus = 'UNKNOWN' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILED';

interface CurrentPayment {
  type: 'wallet' | 'exchange';
  exchangeId?: string;
  sessionId?: string;
  status?: PayStatus;
  result?: string;
}

interface PaymentOptions {
  amount: number;
  useRebuyFund?: boolean;
  rebuyAmount?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function usePayController(options: PaymentOptions) {
  const { address, isConnected } = useAccount();
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentInProgress, setIsPaymentInProgress] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<CurrentPayment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | undefined>();
  const [txHash, setTxHash] = useState<string | null>(null);
  const { isConnected: appkitConnected, openModal } = useAppKit();

  // Default to BSC USDT
  const defaultAsset: AppkitPaymentAsset = {
    network: 'eip155:56' as `eip155:${string}`,
    asset: '0x55d398326f99059fF775485246999027B3197955',
    metadata: {
      symbol: 'USDT',
      decimals: 18,
      name: 'Tether USD',
    },
  };

  // 使用固定的收款地址
  const recipient = '0x915082634caD7872D789005EBFaaEF98f002F9E0';

  const { open: openPay, isPending: payPending } = usePay({
    onSuccess: (data: any) => {
      setTxHash(data?.txHash || '');
      setCurrentPayment(prev => prev ? { ...prev, status: 'SUCCESS', result: data?.txHash } : null);
      setIsPaymentInProgress(false);
      if (options.onSuccess) options.onSuccess(data);
    },
    onError: (err: any) => {
      const errorMessage = typeof err === 'string' ? err : err?.message || 'Payment failed';
      setError(errorMessage);
      setCurrentPayment(prev => prev ? { ...prev, status: 'FAILED' } : null);
      setIsPaymentInProgress(false);
      if (options.onError) options.onError(err);
    },
  });

  const decimals = defaultAsset.metadata.decimals;

  // Repurchase fund payment method
  const payWithRebuyFund = useCallback(async (rebuyAmount: number) => {
    if (!address) throw new Error('Wallet address is missing');
    
    // 1. Query user ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('wallet_address', address)
      .single();
    if (userError || !userData) throw new Error('User not found');
    
    // 2. Query balance
    const { data: balanceData, error: balanceError } = await supabase
      .from('user_balance')
      .select('credit_balance')
      .eq('user_id', userData.id)
      .single();
    if (balanceError || !balanceData) throw new Error('Balance not found');
    
    const creditBalance = balanceData.credit_balance;
    if (creditBalance == null || creditBalance < rebuyAmount) {
      throw new Error('Insufficient repurchase fund balance');
    }
    
    // 3. Deduct balance
    const { error: updateError } = await supabase
      .from('user_balance')
      .update({ credit_balance: creditBalance - rebuyAmount })
      .eq('user_id', userData.id);
    if (updateError) throw new Error('Failed to deduct repurchase fund balance');
    
    return { txHash: 'rebuy_tx_hash' };
  }, [address]);

  const handlePayWithWallet = useCallback(async () => {
    if (!appkitConnected || !address) {
      setError('Please connect your wallet first');
      await openModal();
      return;
    }

    try {
      setIsPaymentInProgress(true);
      setCurrentPayment({ 
        type: 'wallet',
        status: 'IN_PROGRESS'
      });
      setPaymentId(crypto.randomUUID());

      if (options.useRebuyFund) {
        // 动态传入复投金金额
        const rebuyAmount = options.rebuyAmount || 25;
        await payWithRebuyFund(rebuyAmount);
        // 动态传入钱包支付金额
        await openPay({
          paymentAsset: defaultAsset,
          recipient,
          amount: options.amount - rebuyAmount
        });
      } else {
        // 动态传入总金额
        await openPay({
          paymentAsset: defaultAsset,
          recipient,
          amount: options.amount
        });
      }
    } catch (err: any) {
      const errorMessage = typeof err === 'string' ? err : err?.message || 'Payment failed';
      setError(errorMessage);
      setCurrentPayment(prev => prev ? { ...prev, status: 'FAILED' } : null);
      if (options.onError) options.onError(err);
    } finally {
      setIsPaymentInProgress(false);
    }
  }, [appkitConnected, address, options.useRebuyFund, payWithRebuyFund, openPay, openModal]);

  const handlePayWithExchange = useCallback(async (exchangeId: string): Promise<PaymentResult | null> => {
    try {
      setIsPaymentInProgress(true);
      setCurrentPayment({ 
        type: 'exchange',
        exchangeId,
        sessionId: 'session-' + Date.now(),
        status: 'IN_PROGRESS'
      });
      setPaymentId(crypto.randomUUID());

      // 调用 Appkit 的 openPay，传递 exchangeId
      const payParams: any = {
        paymentAsset: defaultAsset,
        recipient,
        amount: options.amount,
      };
      if (exchangeId) payParams.exchangeId = exchangeId;
      await openPay(payParams);
      // openPay会自动处理跳转或弹窗，这里无需返回url
      return {
        url: '',
        openInNewTab: true
      };
    } catch (err: any) {
      const errorMessage = typeof err === 'string' ? err : err?.message || 'Payment failed';
      setError(errorMessage);
      setCurrentPayment(prev => prev ? { ...prev, status: 'FAILED' } : null);
      return null;
    }
  }, [openPay, options.amount, recipient, defaultAsset]);

  const updateBuyStatus = useCallback(async (exchangeId: string, sessionId: string) => {
    try {
      // Implement exchange payment status update logic here
      console.log('Updating buy status:', { exchangeId, sessionId });
      setCurrentPayment(prev => prev ? { ...prev, status: 'SUCCESS' } : null);
      setIsPaymentInProgress(false);
    } catch (err: any) {
      const errorMessage = typeof err === 'string' ? err : err?.message || 'Failed to update payment status';
      setError(errorMessage);
      setCurrentPayment(prev => prev ? { ...prev, status: 'FAILED' } : null);
    }
  }, []);

  const resetState = useCallback(() => {
    setCurrentPayment(null);
    setIsPaymentInProgress(false);
    setError(null);
    setPaymentId(undefined);
    setTxHash(null);
  }, []);

  return {
    exchanges,
    isLoading,
    isPaymentInProgress: isPaymentInProgress || payPending,
    currentPayment,
    error,
    paymentId,
    txHash,
    handlePayWithWallet,
    handlePayWithExchange,
    updateBuyStatus,
    resetState
  };
} 