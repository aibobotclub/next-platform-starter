'use client'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { AppKitNetwork, base } from '@reown/appkit/networks'
import { createAppKit } from '@reown/appkit/react'

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'b56e18d47c72ab683b10814fe9495694'
const networks = [base] as [AppKitNetwork, ...AppKitNetwork[]]

const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks
})

const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  metadata: {
    name: 'AIDA Pay',
    description: 'Pay securely with AppKit. Supports Base USDC.',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://aida.one',
    icons: [`${process.env.NEXT_PUBLIC_APP_URL || 'https://aida.one'}/logo.png`]
  },
  projectId,
  themeMode: 'dark',
  features: {
    analytics: true
  }
})

export { modal, wagmiAdapter, projectId, networks }

const config = {
  modal,
  networks,
  wagmiAdapter,
  projectId
};
export default config;