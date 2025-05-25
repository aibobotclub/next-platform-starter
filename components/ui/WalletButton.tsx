"use client";

import { useAccount } from "wagmi";
import { Button } from "./button";
import { useAppKit } from '@/hooks/useAppKit';

export default function WalletButton() {
  const { address } = useAccount();
  const { openModal } = useAppKit();

  return (
    <Button onClick={openModal}>
      {address
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : "Connect Wallet"}
    </Button>
  );
} 