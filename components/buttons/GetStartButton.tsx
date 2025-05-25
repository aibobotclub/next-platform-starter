"use client";

import { useAppKit } from '@/hooks/useAppKit';
import ConnectWallet from "@/components/connectwallet/ConnectWallet";
import DashboardButton from "@/components/buttons/DashboardButton";
import styles from './GetStartButton.module.css'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface GetStartButtonProps {
  onClick?: () => void;
}

export default function GetStartButton({ onClick }: GetStartButtonProps) {
  const { isConnected, address } = useAppKit();
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isConnected || !address) return;
    const CHECK_USER_URL = process.env.NEXT_PUBLIC_CHECK_USER_URL || '';
    if (!CHECK_USER_URL) {
      throw new Error('CHECK_USER_URL is not set');
    }
    setIsLoading(true);
    fetch(CHECK_USER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet_address: address })
    })
      .then(res => res.json())
      .then(data => setIsRegistered(data.isRegistered))
      .finally(() => setIsLoading(false));
  }, [isConnected, address]);

  if (isLoading) {
    return <button className={styles.getStartedButton} disabled>Loading...</button>;
  }

  if (!isConnected) {
    return (
      <div className={styles.buttonContainer}>
        <ConnectWallet 
          buttonText="Connect Wallet"
          className={styles.getStartedButton}
        />
      </div>
    );
  }

  if (isConnected && !isRegistered) {
    return (
      <div className={styles.buttonContainer}>
        <button 
          onClick={() => router.push('/register')}
          className={styles.getStartedButton}
        >
          Get Started
        </button>
      </div>
    );
  }

  // 已连接且已注册，直接进入 Dashboard
  return (
    <div className={styles.buttonContainer}>
      <DashboardButton className={styles.getStartedButton} />
    </div>
  );
}
