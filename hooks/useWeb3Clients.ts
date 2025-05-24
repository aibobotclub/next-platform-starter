import { useWalletClient } from "wagmi";
import { useMemo } from "react";
import { createPublicClient, http } from "viem";

// BSC 主网配置
const bscChain = {
  id: 56,
  name: "Binance Smart Chain",
  network: "bsc",
  nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  rpcUrls: { 
    default: { 
      http: ["https://bsc-dataseed.binance.org"],
      webSocket: ["wss://bsc-ws-node.nariox.org:443"]
    },
    public: { 
      http: ["https://bsc-dataseed.binance.org"],
      webSocket: ["wss://bsc-ws-node.nariox.org:443"]
    }
  },
  blockExplorers: { 
    default: { 
      name: "BscScan", 
      url: "https://bscscan.com" 
    }
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 15921452
    }
  },
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