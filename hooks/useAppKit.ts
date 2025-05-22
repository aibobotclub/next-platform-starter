'use client';

import { useAccount, useBalance, useChainId, useSwitchChain } from 'wagmi';
import { useAppKit as useAppKitHook, useAppKitNetwork } from '@reown/appkit/react';
import { useEffect, useState } from 'react';

export function useAppKit() {
  const { open, close } = useAppKitHook();
  const { switchNetwork } = useAppKitNetwork();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balanceData } = useBalance({
    address,
    query: {
      enabled: Boolean(address),
    },
  });

  // Add SSR safety
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Return placeholder values during SSR to prevent hydration mismatch
  if (!mounted) {
    return {
      address: undefined,
      isConnected: false,
      chainId: undefined,
      balance: undefined,
      openModal: () => open(),
      closeModal: () => close(),
      switchNetwork: () => Promise.resolve(),
    };
  }

  return {
    address,
    isConnected,
    chainId,
    balance: balanceData,
    openModal: () => open(),
    closeModal: () => close(),
    switchNetwork: () => Promise.resolve(),
  };
}