"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useAccount, useConnect } from "wagmi";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { HomeNavbar } from "./navbar/HomeNavbar";
import Features from "./sections/Features";
import Pricing from "./sections/Pricing";
import About from "./sections/About";
import DownloadSection from "./sections/Download";
import Footer from "./footer/Footer";
import styles from "./HomePage.module.css";
import RegisterForm from "@/components/register/RegisterForm";
import { useUserStatus } from "@/hooks/useUserStatus";


// 动态导入 Hero 组件
const Hero = dynamic(() => import("./sections/Hero"), { 
  ssr: false,
  loading: () => <div className="h-screen flex items-center justify-center">Loading...</div>
});

const COMPANY_ADDRESS = "0xfAaac7bcd4f371A4f13f61E63e7e2B7d669427b1";

// 格式化地址显示
const formatAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default function LandingPage() {
  const { isConnected, address } = useAccount();
  const { isRegistered, isLoading: isUserStatusLoading } = useUserStatus();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [referrerAddress, setReferrerAddress] = useState<string | null>(null);

  // Debug log for connection and registration status
  useEffect(() => {
    console.log('[LandingPage] isConnected:', isConnected, 'address:', address, 'isRegistered:', isRegistered, 'isLoading:', isUserStatusLoading);
  }, [isConnected, address, isRegistered, isUserStatusLoading]);

  // 初始化
  useEffect(() => {
    setMounted(true);
    const referrer = searchParams?.get('referral');
    if (referrer) {
      setReferrerAddress(referrer);
    }
    return () => setMounted(false);
  }, [searchParams]);

  // 路由变化处理
  useEffect(() => {
    const handleRouteChange = () => setShowRegisterForm(false);
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  // 检查用户状态并自动跳转
  useEffect(() => {
    if (!isUserStatusLoading && isConnected && !isRegistered) {
      console.log('[LandingPage] Wallet connected but not registered, redirecting to /register');
      router.replace('/register');
    }
  }, [isConnected, isRegistered, isUserStatusLoading, router]);

  // 断开连接后刷新页面，确保按钮状态及时更新
  useEffect(() => {
    if (!isConnected && mounted) {
      router.refresh();
    }
  }, [isConnected, mounted, router]);

  // 处理开始按钮点击
  const handleGetStarted = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    // 优先用 URL 的 referral，没有就用公司地址
    const refAddress = referrerAddress || COMPANY_ADDRESS;
    router.push(`/register?referral=${refAddress}`);
  };

  if (isUserStatusLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <HomeNavbar />
      <main>
        <Hero 
          onGetStarted={handleGetStarted}
          isRegistered={isRegistered}
        />
        <Features />
        <Pricing />
        <About />
        <DownloadSection />
      </main>
      <Footer />
      {showRegisterForm && !isRegistered && (
        <RegisterForm 
          onClose={() => setShowRegisterForm(false)}
          referrerAddress={referrerAddress}
        />
      )}
    </div>
  );
}
