import { useWalletClient } from "wagmi";
import { useMemo } from "react";
import { createPublicClient, http } from "viem";

// BSC 主网配置
const bscChain = {
  id: 56,
  name: "Binance Smart Chain",
  network: "bsc",
  nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  rpcUrls: { default: { http: ["https://bsc-dataseed.binance.org"] } },
  blockExplorers: { default: { name: "BscScan", url: "https://bscscan.com" } },
  testnet: false,
};

const useWeb3Clients = () => {
  const { data: walletClient } = useWalletClient();
  const publicClient = useMemo(
    () =>
      createPublicClient({
        chain: bscChain,
        transport: http(),
        batch: { multicall: true },
      }),
    []
  );

  return { publicClient, walletClient };
};

export default useWeb3Clients;