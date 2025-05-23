'use client'

import { useDisconnect, useAppKit } from '@reown/appkit/react'
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import styles from "@/components/register/RegisterButton.module.css";

interface ConnectWalletButtonProps {
  buttonText?: string;
  className?: string;
}

export const ConnectWallet = ({ buttonText = "Connect Wallet", className }: ConnectWalletButtonProps) => {
    const { disconnect } = useDisconnect();
    const { open } = useAppKit();
    const { isConnected, address } = useAccount();
    const router = useRouter();

    const handleDisconnect = async () => {
      try {
        await disconnect();
        router.push('/');
      } catch (error) {
        console.error("Failed to disconnect:", error);
      }
    }

    if (isConnected && address) {
      return (
        <Button
          className={cn(
            styles.unifiedButton,
            className
          )}
          onClick={() => open()}
        >
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-300 animate-pulse mr-2"></span>
           {address.slice(0, 6)}...{address.slice(-4)}
        </Button>
      )
    }

    return (
      <Button
        className={cn(
          styles.unifiedButton,
          className
        )}
        onClick={() => open()}
      >
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-gray-300 mr-2"></span>
        {buttonText}
      </Button>
    )
}

export default ConnectWallet; 