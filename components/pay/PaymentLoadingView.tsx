"use client";

import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Spinner } from '@/components/ui/spinner';
import { CheckCircle, XCircle } from 'lucide-react';
import styles from './PaymentLoadingView.module.css';

type PaymentState = 'in-progress' | 'completed' | 'error';

interface PaymentLoadingViewProps {
  state: PaymentState;
  message?: string;
  subMessage?: string;
}

export function PaymentLoadingView({ 
  state = 'in-progress',
  message = 'Waiting for payment confirmation',
  subMessage = 'Please confirm the payment in your wallet'
}: PaymentLoadingViewProps) {
  const { themeVariables } = useTheme();

  const renderStateIcon = () => {
    switch (state) {
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
        <h2 className={styles.loadingMessage}>{message}</h2>
        <p className={styles.subMessage}>{subMessage}</p>
      </div>
    </div>
  );
} 