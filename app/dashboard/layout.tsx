'use client';
import React, { useEffect, useState } from "react";
import { useAppKit } from '@/hooks/useAppKit';
import { useRouter } from "next/navigation";
import Header from "@/components/dashboard/header/Header";
import TabBar from '@/components/dashboard/tabbar/TabBar';
// This layout only applies to /dashboard/* routes. It will NOT affect the Home page or any other routes.
// Home page uses its own HomeNavbar in components/home/navbar/HomeNavbar.tsx

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isConnected, address } = useAppKit();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !isConnected || !address) return;
    const CHECK_USER_URL = process.env.NEXT_PUBLIC_CHECK_USER_URL || '';
    if (!CHECK_USER_URL) {
      throw new Error('CHECK_USER_URL is not set');
    }
    setIsLoading(true);
    fetch(CHECK_USER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet_address: address })
    })
      .then(res => res.json())
      .then(data => setIsRegistered(data.isRegistered))
      .finally(() => setIsLoading(false));
  }, [mounted, isConnected, address]);

  useEffect(() => {
    if (!mounted || isLoading) return;
    if (isChecking) {
      setTimeout(() => {
        setIsChecking(false);
      }, 100);
      return;
    }
    if (!isConnected || !isRegistered) {
      router.replace("/");
    }
  }, [mounted, isConnected, isRegistered, isLoading, router, isChecking]);

  // 加载状态
  if (!mounted || isLoading || isChecking) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Checking...</p>
        </div>
      </div>
    );
  }

  // 未授权状态
  if (!isConnected || !isRegistered) {
    return null;
  }

  return (
    <div className="dashboard-layout">
      <Header />
      <main
        style={{
          minHeight: '80vh',
          width: '100%',
          maxWidth: 420,
          margin: '0 auto',
          padding: '2rem 1rem',
          paddingTop: '72px', // Header高度
          paddingBottom: '72px', // TabBar高度
          boxSizing: 'border-box',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {children}
      </main>
      <TabBar />
    </div>
  );
}