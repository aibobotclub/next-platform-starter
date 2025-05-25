"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAccount } from "wagmi";
import { useAppKit } from "@/hooks/useAppKit";
import RegisterPage from "@/components/register/RegisterPage";
import { toast } from "sonner";
import { useUserStatus } from '@/hooks/useUserStatus';

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isConnected, address } = useAccount();
  const { openModal } = useAppKit();
  const [isChecking, setIsChecking] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const referrer = searchParams.get("ref");
  const { isRegistered, isLoading } = useUserStatus();

  // 自动弹出钱包连接
  useEffect(() => {
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
  }, [isConnected, address, retryCount, openModal, router]);

  // 钱包连接后自动检查注册状态并跳转
  useEffect(() => {
    if (isConnected && !isLoading) {
      if (isRegistered) {
        router.replace("/dashboard");
      } else {
        setIsChecking(false);
      }
    }
  }, [isConnected, isRegistered, isLoading, router]);

  if (isChecking || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Connecting wallet...</p>
        </div>
      </div>
    );
  }

  // 传递 referrer 给 RegisterPage
  return <RegisterPage referrer={referrer} />;
} 