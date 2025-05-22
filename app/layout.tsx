import { headers } from 'next/headers'
import './globals.css';
import { Toaster } from 'sonner'
import type { Metadata } from 'next'
import ContextProvider from '@/context'


// Get projectId from https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error('Missing NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID');
}

// 禁用遥测
if (typeof window !== 'undefined') {
  try {
    window.localStorage.setItem('appkit:telemetry:disabled', 'true');
    window.localStorage.setItem('walletconnect:telemetry:disabled', 'true');
  } catch (error) {
    console.warn('Failed to disable telemetry:', error);
  }
}

export const metadata: Metadata = {
  title: "AIDA - Web3 Platform",
  description: "AIDA Web3 Platform",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const headersData = headers();
  const cookies = headersData.get('cookie');

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
  
          <ContextProvider cookies={cookies}>
            {children}
            <Toaster position="top-right" />
          </ContextProvider>
    
      </body>
    </html>
  );
}