import { useState, useCallback } from 'react';
import { usePay } from '@reown/appkit-pay/react';
import { useAccount } from 'wagmi';
import { supabase } from '@/lib/supabase';
import type { PaymentAsset as AppkitPaymentAsset } from '@reown/appkit-pay';

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

  // Default to OP chain USDT
  const defaultAsset: AppkitPaymentAsset = {
    network: 'eip155:10' as `eip155:${string}`,
    asset: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
    metadata: {
      symbol: 'USDT',
      decimals: 18,
      name: 'Tether USD',
    },
  };

  // 使用固定的收款地址
  const recipient = '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58';

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
    if (!isConnected || !address) {
      setError('Please connect your wallet first');
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
        // First pay 25 with repurchase fund
        await payWithRebuyFund(25);
        // Then pay 25 with OP USDT
        await openPay({
          paymentAsset: defaultAsset,
          recipient,
          amount: 25
        });
      } else {
        // Pay full 50 with OP USDT
        await openPay({
          paymentAsset: defaultAsset,
          recipient,
          amount: 50
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
  }, [isConnected, address, options.useRebuyFund, payWithRebuyFund, openPay]);

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

      // Implement exchange payment logic here
      console.log('Paying with exchange:', exchangeId);
      return {
        url: 'https://example.com/pay',
        openInNewTab: true
      };
    } catch (err: any) {
      const errorMessage = typeof err === 'string' ? err : err?.message || 'Payment failed';
      setError(errorMessage);
      setCurrentPayment(prev => prev ? { ...prev, status: 'FAILED' } : null);
      return null;
    }
  }, []);

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