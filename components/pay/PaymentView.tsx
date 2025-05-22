"use client";

import React, { useEffect, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Separator } from '@/components/ui/separator';
import { usePayController } from '@/hooks/usePayController';
import { useChainController } from '@/hooks/useChainController';
import { useSnackbar } from '@/hooks/useSnackbar';
import { isPayWithWalletSupported } from '@/utils/assetUtil';
import styles from './PaymentView.module.css';

interface Exchange {
  id: string;
  name: string;
  imageUrl?: string;
}

export function PaymentView() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { showError } = useSnackbar();
  const { handlePayWithWallet, handlePayWithExchange, exchanges, isLoading } = usePayController({
    amount: 50,
    useRebuyFund: false,
    onSuccess: (data) => {
      console.log('Payment successful:', data);
    },
    onError: (error) => {
      console.error('Payment failed:', error);
      showError('Payment failed');
    }
  });
  const { getAllRequestedCaipNetworks } = useChainController();

  const [amount, setAmount] = useState('50');
  const [tokenSymbol, setTokenSymbol] = useState('USDT');
  const [networkName, setNetworkName] = useState('eip155:10');
  const [loadingExchangeId, setLoadingExchangeId] = useState<string | null>(null);

  const renderPaymentHeader = () => {
    let displayNetworkName = networkName;
    if (networkName) {
      const allNetworks = getAllRequestedCaipNetworks();
      const targetNetwork = allNetworks.find(net => net.caipNetworkId === networkName);
      if (targetNetwork) {
        displayNetworkName = targetNetwork.name;
      }
    }

    return (
      <div className={styles.paymentHeader}>
        <div className={styles.amountContainer}>
          <span className={styles.amount}>{amount || '0.0000'}</span>
          <div className={styles.tokenDisplay}>
            <span className={styles.tokenSymbol}>{tokenSymbol || 'Unknown Asset'}</span>
            {displayNetworkName && (
              <span className={styles.networkName}> on {displayNetworkName}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderPayWithWallet = () => {
    if (!isPayWithWalletSupported(networkName)) {
      return null;
    }

    return (
      <div className={styles.walletSection}>
        {isConnected ? renderConnectedView() : renderDisconnectedView()}
        <Separator className={styles.separator}>or</Separator>
      </div>
    );
  };

  const renderConnectedView = () => (
    <div className={styles.connectedView}>
      <Button
        onClick={handlePayWithWallet}
        className={styles.walletButton}
        data-testid="wallet-payment-option"
      >
        <div className={styles.walletButtonContent}>
          <img
            src="/wallet-icon.png"
            alt="Wallet"
            className={styles.walletIcon}
          />
          <span>Pay with connected wallet</span>
        </div>
      </Button>

      <Button
        variant="ghost"
        onClick={handleDisconnect}
        className={styles.disconnectButton}
        data-testid="disconnect-button"
      >
        Disconnect
      </Button>
    </div>
  );

  const renderDisconnectedView = () => (
    <Button
      onClick={handlePayWithWallet}
      className={styles.walletButton}
      data-testid="wallet-payment-option"
    >
      <div className={styles.walletButtonContent}>
        <img
          src="/wallet-placeholder.png"
          alt="Wallet"
          className={styles.walletIcon}
        />
        <span>Pay from wallet</span>
      </div>
    </Button>
  );

  const renderExchangeOptions = () => {
    if (isLoading) {
      return (
        <div className={styles.loadingContainer}>
          <Spinner size="md" />
        </div>
      );
    }

    if (exchanges.length === 0) {
      return (
        <div className={styles.noExchanges}>
          <span>No exchanges available</span>
        </div>
      );
    }

    return exchanges.map((exchange: Exchange) => (
      <Button
        key={exchange.id}
        onClick={() => handleExchangePayment(exchange.id)}
        className={styles.exchangeButton}
        data-testid={`exchange-option-${exchange.id}`}
        disabled={loadingExchangeId !== null}
      >
        <div className={styles.exchangeButtonContent}>
          {loadingExchangeId === exchange.id ? (
            <Spinner size="md" color="accent" />
          ) : (
            <img
              src={exchange.imageUrl}
              alt={exchange.name}
              className={styles.exchangeIcon}
            />
          )}
          <span>Pay with {exchange.name}</span>
          <Spinner size="sm" className={styles.exchangeSpinner} />
        </div>
      </Button>
    ));
  };

  const handleExchangePayment = async (exchangeId: string) => {
    try {
      setLoadingExchangeId(exchangeId);
      const result = await handlePayWithExchange(exchangeId);
      if (result) {
        window.open(result.url, result.openInNewTab ? '_blank' : '_self');
      }
    } catch (error) {
      console.error('Failed to pay with exchange', error);
      showError('Failed to pay with exchange');
    } finally {
      setLoadingExchangeId(null);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Failed to disconnect');
      showError('Failed to disconnect');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {renderPaymentHeader()}
        <div className={styles.paymentOptions}>
          {renderPayWithWallet()}
          {renderExchangeOptions()}
        </div>
      </div>
    </div>
  );
} 