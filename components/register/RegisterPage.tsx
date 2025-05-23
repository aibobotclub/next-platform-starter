"use client";

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter, useSearchParams } from 'next/navigation';
import { HomeNavbar } from '@/components/home/navbar/HomeNavbar';
import dynamic from 'next/dynamic';
const RegisterForm = dynamic(() => import('./RegisterForm'), { ssr: false });
import ConnectWallet from '@/components/connectwallet/ConnectWallet';
import RegisterButton from './RegisterButton';
import styles from './RegisterPage.module.css';
import { useUserStatus } from '@/hooks/useUserStatus';

interface RegisterPageProps {
  referrer?: string | null;
}

export default function RegisterPage({ referrer }: RegisterPageProps) {
  const { isConnected, address } = useAccount();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isRegistered, isLoading } = useUserStatus();
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  useEffect(() => {
    if (isRegistered) {
      router.replace('/dashboard');
    }
  }, [isRegistered, router]);

  // 自动弹出注册表单
  useEffect(() => {
    if (isConnected && !isRegistered) {
      setShowRegisterForm(true);
    }
  }, [isConnected, isRegistered]);

  // 未连接钱包或地址无效时只显示连接钱包按钮
  if (!isConnected || !address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return (
      <div className={styles.container}>
        <HomeNavbar />
        <main className={styles.main}>
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.title}>加入 AIDA Club</h1>
              <p className={styles.subtitle}>
                Connect your wallet and complete registration to start using
              </p>
            </div>
            <div className={styles.actionArea}>
              <ConnectWallet
                buttonText="Connect Wallet to Register"
                className={styles.registerButton}
              />
            </div>
            <div className={styles.info}>
              <h3>Why Register?</h3>
              <ul className={styles.benefits}>
                <li>Access exclusive features and content</li>
                <li>Participate in community activities</li>
                <li>Earn rewards and benefits</li>
                <li>Connect with other members</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 钱包已连接但未注册，显示连接钱包和注册按钮
  if (isConnected && !isRegistered) {
    return (
      <div className={styles.container}>
        <HomeNavbar />
        <main className={styles.main}>
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.title}>加入 AIDA Club</h1>
              <p className={styles.subtitle}>
                Connect your wallet and complete registration to start using
              </p>
            </div>
            <div className={styles.actionArea}>
              <ConnectWallet
                buttonText="Connect Wallet to Register"
                className={styles.registerButton}
              />
              <RegisterButton isLoading={isLoading} onClick={() => setShowRegisterForm(true)} />
            </div>
            {showRegisterForm && (
              <RegisterForm 
                onClose={() => setShowRegisterForm(false)} 
                referrerAddress={referrer}
              />
            )}
            <div className={styles.info}>
              <h3>Why Register?</h3>
              <ul className={styles.benefits}>
                <li>Access exclusive features and content</li>
                <li>Participate in community activities</li>
                <li>Earn rewards and benefits</li>
                <li>Connect with other members</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 加载状态
  if (isLoading) {
    return (
      <div className={styles.container}>
        <HomeNavbar />
        <main className={styles.main}>
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.title}>加入 AIDA Club</h1>
              <p className={styles.subtitle}>
                连接钱包并完成注册以开始使用
              </p>
            </div>
            <div className={styles.formContainer}>
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>正在检查用户状态...</p>
              </div>
            </div>
            <div className={styles.info}>
              <h3>为什么要注册？</h3>
              <ul className={styles.benefits}>
                <li>访问独家功能和内容</li>
                <li>参与社区活动</li>
                <li>获得奖励和福利</li>
                <li>与其他会员交流</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 其它情况（如已注册）
  return null;
}
