import { useWalletClient } from "wagmi";
import { useMemo, useCallback } from "react";
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

  // 自动切换/添加 BSC 主网
  const ensureBscNetwork = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) return;
    try {
      await (window.ethereum as any).request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x38' }],
      });
    } catch (switchError: any) {
      // 如果未添加则自动添加
      if (switchError.code === 4902) {
        await (window.ethereum as any).request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x38',
            chainName: 'Binance Smart Chain',
            nativeCurrency: {
              name: 'BNB',
              symbol: 'BNB',
              decimals: 18
            },
            rpcUrls: ['https://bsc-dataseed.binance.org'],
            blockExplorerUrls: ['https://bscscan.com']
          }],
        });
      }
    }
  }, []);

  return { publicClient, walletClient, ensureBscNetwork };
};

export default useWeb3Clients;