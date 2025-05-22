import { useDisconnect, useAppKit, useAppKitAccount  } from '@reown/appkit/react'
import { usePay } from '@reown/appkit-pay/react';

// OP链 USDT 配置，network 字段类型严格
const optimismUSDT = {
  network: 'eip155:10' as const, // Optimism 主网
  asset: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58', // USDT (OP)
  metadata: {
    symbol: 'USDT',
    decimals: 6,
    name: 'Tether USD',
    icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
  },
};

export const PayButton = ({ amount, onSuccess, onError }: { amount: number, onSuccess: (data: any) => void, onError: (err: any) => void }) => {
    const { disconnect } = useDisconnect();
    const { open } = useAppKit();
    const { address } = useAppKitAccount();
    const { open: openPay, isPending, isSuccess, data, error } = usePay({
      onSuccess,
      onError,
    });

    const handleDisconnect = async () => {
      try {
        await disconnect();
      } catch (error) {
        console.error("Failed to disconnect:", error);
      }
    };

    const handlePay = async () => {
      await openPay({
        paymentAsset: optimismUSDT,
        recipient: address || '',
        amount
      });
    };

  return (
    <div>
      <button onClick={() => open()}>Open</button>
      <button onClick={handleDisconnect}>Disconnect</button>
      <button onClick={handlePay} disabled={isPending || !address}>AppKit Pay</button>
      {isSuccess || isPending || error ? (
        <section>
          <h2>Payment Status</h2>
          {isSuccess && <p>Payment successful: {JSON.stringify(data)}</p>}
          {isPending && <p>Payment pending...</p>}
          {error && <p>Payment error: {typeof error === 'string' ? error : JSON.stringify(error)}</p>}
        </section>
      ) : null}
    </div>
  );
}