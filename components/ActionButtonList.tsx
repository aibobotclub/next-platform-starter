'use client'
import { useDisconnect } from '@reown/appkit/react'
import { useAppKit } from '@/hooks/useAppKit';
import { networks } from '@/config'

export const ActionButtonList = () => {
    const { disconnect } = useDisconnect();
    const { openModal, switchNetwork } = useAppKit();

    const handleDisconnect = async () => {
      try {
        await disconnect();
      } catch (error) {
        console.error("Failed to disconnect:", error);
      }
    }
  return (
    <div>
        <button onClick={openModal}>Open</button>
        <button onClick={handleDisconnect}>Disconnect</button>
        <button onClick={() => switchNetwork()}>Switch</button>
    </div>
  )
}
