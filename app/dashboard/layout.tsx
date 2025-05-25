'use client';
import React, { useEffect, useState } from "react";
import { useAppKit } from '@/hooks/useAppKit';
import { useUserStatus } from "@/hooks/useUserStatus";
import { useRouter } from "next/navigation";
import Header from "@/components/dashboard/header/Header";
import TabBar from '@/components/dashboard/tabbar/TabBar';
// This layout only applies to /dashboard/* routes. It will NOT affect the Home page or any other routes.
// Home page uses its own HomeNavbar in components/home/navbar/HomeNavbar.tsx

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAppKit();
  const { isRegistered, isLoading } = useUserStatus();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    console.log('[dashboard/layout] useEffect', { 
      mounted, 
      isConnected, 
      isRegistered, 
      isLoading, 
      pathname: typeof window !== 'undefined' ? window.location.pathname : '' 
    });
    
    // 只在状态完全就绪后才进行跳转判断
    if (!mounted || isLoading) return;
    
    if (!isConnected || !isRegistered) {
      console.log('[dashboard/layout] 状态未就绪，跳转首页', { isConnected, isRegistered });
      router.replace("/");
    }
  }, [mounted, isConnected, isRegistered, isLoading, router]);

  // 加载状态
  if (!mounted || isLoading) {
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