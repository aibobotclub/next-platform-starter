'use client';

import { useAccount } from 'wagmi';
import { useAppKit as useAppKitHook } from '@reown/appkit/react';
import { useEffect, useState } from 'react';

export function useAppKit() {
  const { open } = useAppKitHook();
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return {
      address: undefined,
      isConnected: false,
      openModal: () => open(),
    };
  }

  return {
    address,
    isConnected,
    openModal: () => open(),
  };
}