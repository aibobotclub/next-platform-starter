"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { usePayController } from '@/hooks/usePayController';
import { useTheme } from '@/hooks/useTheme';
import { Spinner } from '@/components/ui/spinner';
import { CheckCircle, XCircle } from 'lucide-react';
import styles from './PaymentLoadingView.module.css';

type PaymentState = 'in-progress' | 'completed' | 'error';

const EXCHANGE_STATUS_CHECK_INTERVAL = 4000;

export function PaymentLoadingView() {
  const { currentPayment, isPaymentInProgress, error, updateBuyStatus } = usePayController({
    amount: 50,
    useRebuyFund: false,
    onSuccess: (data) => {
      console.log('Payment successful:', data);
    },
    onError: (error) => {
      console.error('Payment failed:', error);
    }
  });
  const { themeVariables } = useTheme();
  const [loadingMessage, setLoadingMessage] = useState('');
  const [subMessage, setSubMessage] = useState('');
  const [paymentState, setPaymentState] = useState<PaymentState>('in-progress');
  const [exchangeSubscription, setExchangeSubscription] = useState<NodeJS.Timeout>();

  const updateMessages = useCallback(() => {
    switch (paymentState) {
      case 'completed':
        setLoadingMessage('支付完成');
        setSubMessage('您的交易已成功处理');
        break;
      case 'error':
        setLoadingMessage('支付失败');
        setSubMessage('处理您的交易时出现错误');
        break;
      case 'in-progress':
      default:
        if (currentPayment?.type === 'exchange') {
          setLoadingMessage('支付已发起');
          setSubMessage('请在交易所完成支付');
        } else {
          setLoadingMessage('等待支付确认');
          setSubMessage('请在您的钱包中确认支付交易');
        }
        break;
    }
  }, [paymentState, currentPayment?.type]);

  const setupExchangeSubscription = useCallback(() => {
    if (currentPayment?.type !== 'exchange') {
      return;
    }

    const subscription = setInterval(async () => {
      const exchangeId = currentPayment?.exchangeId;
      const sessionId = currentPayment?.sessionId;
      if (exchangeId && sessionId) {
        await updateBuyStatus(exchangeId, sessionId);
        if (currentPayment?.status === 'SUCCESS') {
          clearInterval(subscription);
        }
      }
    }, EXCHANGE_STATUS_CHECK_INTERVAL);

    setExchangeSubscription(subscription);
  }, [currentPayment, updateBuyStatus]);

  const setupSubscription = useCallback(() => {
    // 监听支付状态变化
    if (!isPaymentInProgress && paymentState === 'in-progress') {
      if (error || !currentPayment?.result) {
        setPaymentState('error');
      } else {
        setPaymentState('completed');
      }

      updateMessages();

      // 3秒后关闭模态框
      setTimeout(() => {
        // 实现关闭模态框的逻辑
        console.log('Closing modal...');
      }, 3000);
    }

    // 监听错误状态
    if (error && paymentState === 'in-progress') {
      setPaymentState('error');
      updateMessages();
    }
  }, [isPaymentInProgress, paymentState, error, currentPayment?.result, updateMessages]);

  useEffect(() => {
    setPaymentState(isPaymentInProgress ? 'in-progress' : 'completed');
    updateMessages();
    setupSubscription();
    setupExchangeSubscription();

    return () => {
      if (exchangeSubscription) {
        clearInterval(exchangeSubscription);
      }
    };
  }, [
    isPaymentInProgress,
    updateMessages,
    setupSubscription,
    setupExchangeSubscription,
    exchangeSubscription
  ]);

  const renderStateIcon = () => {
    switch (paymentState) {
      case 'completed':
        return <CheckCircle className={styles.successIcon} size={48} />;
      case 'error':
        return <XCircle className={styles.errorIcon} size={48} />;
      case 'in-progress':
      default:
        const radius = themeVariables['--border-radius'] 
          ? parseInt(themeVariables['--border-radius'].replace('px', ''), 10) * 9 
          : 36;
        return <Spinner size="lg" className={styles.loader} />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>
        {renderStateIcon()}
      </div>
      <div className={styles.messageContainer}>
        <h2 className={styles.loadingMessage}>{loadingMessage}</h2>
        <p className={styles.subMessage}>{subMessage}</p>
      </div>
    </div>
  );
} 