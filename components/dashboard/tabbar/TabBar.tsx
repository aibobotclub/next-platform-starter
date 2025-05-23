import React from 'react';
import { useRouter } from 'next/navigation';
import { FiHome, FiShoppingCart, FiList, FiUsers, FiAward } from "react-icons/fi";
import styles from "./TabBar.module.css";

const TABS = [
  { key: 'order', label: 'Order', icon: FiShoppingCart },
  { key: 'task', label: 'Tasks', icon: FiList },
  { key: 'team', label: 'Team', icon: FiUsers },
  { key: 'reward', label: 'Rewards', icon: FiAward },
] as const;

export default function TabBar() {
  const router = useRouter();

  return (
    <nav className={styles.tabBar}>
      <button
        className={styles.tabButton}
        onClick={() => router.push('/dashboard')}
      >
        <FiHome className={styles.icon} />
        <span className={styles.label}>Home</span>
      </button>
      {TABS.map(tab => {
        const Icon = tab.icon;

        return (
          <button
            key={tab.key}
            className={styles.tabBtn}
            onClick={() => router.push(`/dashboard/${tab.key}`)}
            aria-label={tab.label}
          >
            <Icon className={styles.icon} />
            <span className={styles.label}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
