"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { useAppKit } from '@/hooks/useAppKit';
import { toast } from "sonner";
import styles from "@/components/register/RegisterButton.module.css";

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
  const { isConnected, address } = useAppKit();

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
          wallet_address: address
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
      className={`${styles.unifiedButton} ${className || ''}`}
      style={{ boxShadow: "0 6px 32px 0 rgba(80, 112, 255, 0.18)" }}
    >
      {showIcon && <LayoutDashboard className="w-6 h-6 transition-transform duration-200 group-hover:rotate-12 group-hover:scale-110 group-active:scale-95 group-hover:text-yellow-300" />}
      Dashboard
    </Button>
  );
}
