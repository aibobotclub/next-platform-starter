"use client";

import { useAppKit } from '@/hooks/useAppKit';
import { useUserStatus } from "@/hooks/useUserStatus";
import ConnectWallet from "@/components/connectwallet/ConnectWallet";
import DashboardButton from "@/components/buttons/DashboardButton";
import styles from './GetStartButton.module.css'
import { useRouter } from "next/navigation";

interface GetStartButtonProps {
  onClick?: () => void;
}

export default function GetStartButton({ onClick }: GetStartButtonProps) {
  const { isConnected } = useAppKit();
  const { isRegistered, isLoading } = useUserStatus();
  const router = useRouter();

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
