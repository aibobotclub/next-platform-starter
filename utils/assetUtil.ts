export function isPayWithWalletSupported(networkId: string): boolean {
  // 这里实现检查网络是否支持钱包支付的逻辑
  const supportedNetworks = ['eip155:1', 'eip155:10']; // Ethereum 和 Optimism
  return supportedNetworks.includes(networkId);
} 