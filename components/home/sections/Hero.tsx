"use client";

import { motion } from "framer-motion";
import styles from "./Hero.module.css";
import GetStartButton from "@/components/buttons/GetStartButton";
import DashboardButton from '@/components/buttons/DashboardButton';
import ConnectWallet from '@/components/connectwallet/ConnectWallet';

interface HeroProps {
  onGetStarted?: () => void;
  isRegistered?: boolean;
}

export default function Hero({ onGetStarted, isRegistered }: HeroProps) {
  return (
    <section className={styles.heroSection}>
      <div className={styles.hero}>
        {/* 内容部分 */}
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 小屏专用图片 */}
          <div className={styles.heroBotImgMobileWrapper}>
            <img
              src="/images/ai.png"
              alt="AI Bot"
              className={styles.heroBotImgMobile}
            />
          </div>
          <h1 className={styles.heroTitle}>
            Empowering Global Communication with AI & Web3
          </h1>
          <p className={styles.heroSubtitle}>
            One-click registration, secure wallet, and AI-powered translation for everyone.
          </p>
          <div className={styles.buttonGroup}>
            <DashboardButton />
            <ConnectWallet />
          </div>
        </motion.div>
        {/* 大屏专用图片 */}
        <motion.div
          className={styles.heroDecor}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <img
            src="/images/ai.png"
            alt="AI Bot"
            className={styles.heroBotImg}
          />
        </motion.div>
      </div>
    </section>
  );
}
