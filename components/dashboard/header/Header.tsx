import React from 'react';
import { useRouter } from 'next/navigation';
import styles from "./Header.module.css";
import ConnectWalletButton from "@/components/ui/WalletButton";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function Header() {
  const router = useRouter();
  return (
    <header className={styles.header}>
      <div
        className={styles.logo}
        style={{ cursor: 'pointer' }}
        onClick={() => router.push('/')}
        title="返回首页"
      >
        AIDA
      </div>
      <div className={styles.rightGroup}>
        <div className={styles.walletBtnWrap}>
          <ConnectWalletButton />
        </div>
        <div className={styles.themeToggleWrap}>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
