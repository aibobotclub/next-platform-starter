"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import './DashboardButton.css';
import { cn } from "@/lib/utils";

interface DashboardButtonProps {
  variant?: "default" | "outline" | "ghost";
  className?: string;
  showIcon?: boolean;
}

export default function DashboardButton({ 
  variant = "default",
  className,
  showIcon = true
}: DashboardButtonProps) {
  const router = useRouter();
  const { isConnected, address } = useAccount();

  const handleClick = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/check-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          wallet_address: address.toLowerCase()
        }),
      });
      const data = await response.json();
      if (!data.isRegistered) {
        toast.error('Please complete registration first');
        router.push('/register');
        return;
      }
      router.push('/dashboard');
    } catch (error) {
      console.error('Verification failed:', error);
      toast.error('Verification failed, please try again');
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleClick}
      className={cn(
        "dashboard-btn flex items-center gap-2 px-7 py-3 text-lg font-bold rounded-2xl border-2 border-blue-400 shadow-xl transition-all duration-200 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 hover:border-indigo-400 hover:scale-105 active:scale-95 group",
        className
      )}
      style={{ boxShadow: "0 6px 32px 0 rgba(80, 112, 255, 0.18)" }}
    >
      {showIcon && <LayoutDashboard className="w-6 h-6 transition-transform duration-200 group-hover:rotate-12 group-hover:scale-110 group-active:scale-95 group-hover:text-yellow-300" />}
      Dashboard
    </Button>
  );
}
