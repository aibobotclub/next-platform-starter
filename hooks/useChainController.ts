import { useCallback } from 'react';

interface CaipNetwork {
  caipNetworkId: string;
  name: string;
}

export function useChainController() {
  const getAllRequestedCaipNetworks = useCallback((): CaipNetwork[] => {
    return [
      {
        caipNetworkId: 'eip155:56',
        name: 'BSC'
      }
    ];
  }, []);

  return {
    getAllRequestedCaipNetworks
  };
} 