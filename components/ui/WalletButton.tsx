"use client";

import { useAccount } from "wagmi";
import { Button } from "./button";
import { useAppKit } from "@reown/appkit/react";

export default function WalletButton() {
  const { address } = useAccount();
  const { open } = useAppKit();

  return (
    <Button onClick={() => open({ view: address ? "Account" : "Connect" })}>
      {address
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : "Connect Wallet"}
    </Button>
  );
} 