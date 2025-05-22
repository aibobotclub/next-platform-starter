import styles from "./Header.module.css";
import ConnectWalletButton from "@/components/ui/WalletButton";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>AIDA</div>
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
