import { useCallback } from 'react';

interface CaipNetwork {
  caipNetworkId: string;
  name: string;
}

export function useChainController() {
  const getAllRequestedCaipNetworks = useCallback((): CaipNetwork[] => {
    // 这里实现获取所有支持的链的逻辑
    return [
      {
        caipNetworkId: 'eip155:10',
        name: 'Optimism'
      },
      {
        caipNetworkId: 'eip155:1',
        name: 'Ethereum'
      }
    ];
  }, []);

  return {
    getAllRequestedCaipNetworks
  };
} 