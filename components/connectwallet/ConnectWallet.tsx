'use client'

import { useDisconnect } from '@reown/appkit/react'
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import styles from "@/components/register/RegisterButton.module.css";
import { useAppKit } from '@/hooks/useAppKit';

interface ConnectWalletButtonProps {
  buttonText?: string;
  className?: string;
  onConnected?: () => void;
}

export const ConnectWallet = ({ buttonText = "Connect Wallet", className, onConnected }: ConnectWalletButtonProps) => {
    const { disconnect } = useDisconnect();
    const { isConnected, openModal } = useAppKit();
    const router = useRouter();

    const handleDisconnect = async () => {
      try {
        await disconnect();
        router.push('/');
      } catch (error) {
        console.error("Failed to disconnect:", error);
      }
    }

    if (isConnected) {
      return (
        <Button
          className={cn(styles.unifiedButton, className)}
          onClick={onConnected || openModal}
        >
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-300 animate-pulse mr-2"></span>
          Connected
        </Button>
      )
    }

    return (
      <Button
        className={cn(styles.unifiedButton, className)}
        onClick={openModal}
      >
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-gray-300 mr-2"></span>
        {buttonText}
      </Button>
    )
}

export default ConnectWallet; 