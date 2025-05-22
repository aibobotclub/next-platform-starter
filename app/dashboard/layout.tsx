'use client';
import React, { useEffect } from "react";
import { useAccount } from "wagmi";
import { useUserStatus } from "@/hooks/useUserStatus";
import { useRouter } from "next/navigation";
import Header from "@/components/dashboard/header/Header";
// This layout only applies to /dashboard/* routes. It will NOT affect the Home page or any other routes.
// Home page uses its own HomeNavbar in components/home/navbar/HomeNavbar.tsx

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();
  const { isRegistered, isLoading } = useUserStatus();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isConnected || !isRegistered)) {
      router.replace("/");
    }
  }, [isConnected, isRegistered, isLoading, router]);

  if (!isConnected || isLoading || !isRegistered) {
    return <div className="h-screen flex items-center justify-center text-xl">Checking...</div>;
  }

  return (
    <>
      <Header />
      <main
        style={{
          minHeight: '80vh',
          width: '100%',
          maxWidth: 420,
          margin: '0 auto',
          padding: '2rem 1rem',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </main>
    </>
  );
}