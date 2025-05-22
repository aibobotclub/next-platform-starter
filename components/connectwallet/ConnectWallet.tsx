'use client'

import { useDisconnect, useAppKit } from '@reown/appkit/react'
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
            "dashboard-btn flex items-center gap-2 px-7 py-3 text-lg font-bold rounded-2xl border-2 border-green-400 shadow-xl transition-all duration-200 bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-lime-600 hover:border-emerald-400 hover:scale-105 active:scale-95 group",
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
          "dashboard-btn flex items-center gap-2 px-7 py-3 text-lg font-bold rounded-2xl border-2 border-blue-400 shadow-xl transition-all duration-200 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 hover:border-indigo-400 hover:scale-105 active:scale-95 group",
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