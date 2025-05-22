import { FiShoppingCart, FiList, FiUsers, FiAward } from "react-icons/fi";
import styles from "./TabBar.module.css";

const TABS = [
  { key: 'order', label: 'Order', icon: FiShoppingCart },
  { key: 'task', label: 'Tasks', icon: FiList },
  { key: 'team', label: 'Team', icon: FiUsers },
  { key: 'reward', label: 'Rewards', icon: FiAward },
] as const;

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <nav className={styles.tabBar}>
      {TABS.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            className={`${styles.tabBtn} ${isActive ? styles.active : ""}`}
            onClick={() => onTabChange(tab.key)}
            aria-label={tab.label}
          >
            <Icon className={styles.icon} />
            <span className={styles.label}>{tab.label}</span>
            {isActive && <div className={styles.activeIndicator} />}
          </button>
        );
      })}
    </nav>
  );
}
