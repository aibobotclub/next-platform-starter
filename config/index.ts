'use client'
import { useAppkitPay } from '@/hooks/useAppkitPay'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { AppKitNetwork,optimism } from '@reown/appkit/networks'
import {
  createAppKit,
  useAppKit,
  useAppKitAccount,
  useAppKitEvents,
  useAppKitNetwork,
  useAppKitState,
  useAppKitTheme,
  useDisconnect,
  useWalletInfo
} from '@reown/appkit/react'

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'b56e18d47c72ab683b10814fe9495694' // this is a public projectId only to use on localhost

export const networks = [optimism] as [
  AppKitNetwork,
  ...AppKitNetwork[]
]

// Setup wagmi adapter
export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId
})

// Create modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  metadata: {
    name: 'AIDA Pay',
    description: 'Pay securely with AppKit. Supports OP USDT and Repurchase Fund.',
    url: 'https://localhost:3000',
    icons: ['https://localhost:3000/logo.png']
  },
  projectId,
  themeMode: 'light',
  features: {
    analytics: true
  }
})

export {
  modal,
  useAppKit,
  useAppKitState,
  useAppKitTheme,
  useAppKitEvents,
  useAppKitAccount,
  useWalletInfo,
  useAppKitNetwork,
  useDisconnect,
  useAppkitPay
}

// 保证有默认导出 config 对象
const config = {
  modal,
  networks,
  wagmiAdapter,
  projectId
};
export default config;