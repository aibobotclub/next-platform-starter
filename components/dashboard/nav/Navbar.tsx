'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAppKit } from '@/hooks/useAppKit';
import { useDisconnect } from 'wagmi';
import { FaBars, FaTimes } from 'react-icons/fa';
import styles from './NavBar.module.css';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/task', label: 'Tasks' },
  { href: '/order', label: 'Orders' },
  { href: '/reward', label: 'Rewards' },
];
const Navbar = () => {
  const { address, isConnected, openModal } = useAppKit();
  const { disconnect } = useDisconnect();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Format address for display
  const formatAddress = (address: string | undefined) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Handle wallet connection
  const handleConnectWallet = () => {
    openModal();
    setIsMobileMenuOpen(false);
  };

  // Handle wallet disconnection
  const handleDisconnect = () => {
    disconnect();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={styles.navbarRoot}>
      <div className={styles.navbarContainer}>
        <span className={styles.logo}>AIDA</span>
        {/* Desktop nav links */}
        <nav className={`${styles.navLinks} hidden lg:flex`}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          ))}
        </nav>
        {/* Desktop actions */}
        <div className={`${styles.actions} hidden lg:flex`}>
          {isConnected && address ? (
            <Button
              onClick={handleDisconnect}
              className={cn(
                "dashboard-btn flex items-center gap-2 px-7 py-3 text-lg font-bold rounded-2xl border-2 border-green-400 shadow-xl transition-all duration-200 bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-lime-600 hover:border-emerald-400 hover:scale-105 active:scale-95 group"
              )}
            >
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-300 animate-pulse mr-2"></span>
              Connected {formatAddress(address)}
            </Button>
          ) : (
            <Button
              onClick={handleConnectWallet}
              className={cn(
                "dashboard-btn flex items-center gap-2 px-7 py-3 text-lg font-bold rounded-2xl border-2 border-blue-400 shadow-xl transition-all duration-200 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 hover:border-indigo-400 hover:scale-105 active:scale-95 group"
              )}
            >
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-gray-300 mr-2"></span>
              Connect Wallet
            </Button>
          )}
          <ThemeToggle />
        </div>
        {/* Mobile hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-slate-50 hover:bg-gray-100 transition-all block lg:hidden ml-auto z-50"
          aria-label="Open menu"
        >
          {isMobileMenuOpen ? <FaTimes className="h-6 w-6 text-gray-700" /> : <FaBars className="h-6 w-6 text-gray-700" />}
        </button>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className={styles.mobileCloseBtn}
            aria-label="Close menu"
          >
            <FaTimes className="h-6 w-6 text-gray-700" />
          </button>
          {/* User info */}
          {isConnected && address && (
            <div className={styles.mobileUserInfo}>
              <span>Wallet</span>
              <span className={styles.mobileAddress}>{formatAddress(address)}</span>
            </div>
          )}
          <ul className={styles.mobileNavLinks}>
            {navLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={styles.mobileNavLink}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className={styles.mobileDivider} />
          <div className={styles.mobileActions}>
            {isConnected && address ? (
              <Button
                onClick={handleDisconnect}
                className={cn(
                  "dashboard-btn flex items-center gap-2 px-7 py-3 text-lg font-bold rounded-2xl border-2 border-green-400 shadow-xl transition-all duration-200 bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-lime-600 hover:border-emerald-400 hover:scale-105 active:scale-95 group w-full"
                )}
              >
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-300 animate-pulse mr-2"></span>
                Connected {formatAddress(address)}
              </Button>
            ) : (
              <Button
                onClick={handleConnectWallet}
                className={cn(
                  "dashboard-btn flex items-center gap-2 px-7 py-3 text-lg font-bold rounded-2xl border-2 border-blue-400 shadow-xl transition-all duration-200 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 hover:border-indigo-400 hover:scale-105 active:scale-95 group w-full"
                )}
              >
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-gray-300 mr-2"></span>
                Connect Wallet
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;