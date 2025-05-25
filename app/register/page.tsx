"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppKit } from "@/hooks/useAppKit";
import RegisterPage from "@/components/register/RegisterPage";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isConnected, address, openModal } = useAppKit();
  const [isChecking, setIsChecking] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const referrer = searchParams.get("ref");

  useEffect(() => { setMounted(true); }, []);

  // 自动弹出钱包连接
  useEffect(() => {
    if (!mounted) return;
    let timeoutId: NodeJS.Timeout;
    if (!isConnected || !address) {
      if (retryCount < 3) {
        openModal();
        timeoutId = setTimeout(() => {
          setRetryCount((prev) => prev + 1);
        }, 2000);
      } else {
        toast.error("Please connect your wallet first");
        router.replace("/");
      }
      return () => { if (timeoutId) clearTimeout(timeoutId); };
    }
  }, [mounted, isConnected, address, retryCount, openModal, router]);

  // 钱包连接后自动检查注册状态并跳转
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
    if (isConnected) {
      if (isRegistered) {
        router.replace("/dashboard");
      } else {
        setIsChecking(false);
      }
    }
  }, [mounted, isConnected, isRegistered, isLoading, router]);

  if (!mounted || isChecking || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Connecting wallet...</p>
        </div>
      </div>
    );
  }

  return <RegisterPage referrer={referrer} />;
} 