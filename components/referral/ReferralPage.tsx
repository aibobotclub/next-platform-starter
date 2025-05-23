'use client';

import React, { useState } from 'react';
import { Tabs } from 'antd';
import { ReferralLink } from './ReferralLink/ReferralLink';
import ReferralTree from './ReferralTree/ReferralTree';
import ReferralList from './ReferralList/ReferralList';
import styles from './ReferralPage.module.css';
import { IoShareSocialOutline } from 'react-icons/io5';
import { useAccount } from 'wagmi';

export default function ReferralPage() {
  const [showLink, setShowLink] = useState(false);
  const { address } = useAccount();
  const tabItems = [
    {
      key: 'tree',
      label: '🌲 My Organization Structure',
      children: <ReferralTree />, 
    },
    {
      key: 'list',
      label: '📋 My Referral Record',
      children: <ReferralList />, 
    },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>My Referral System</h2>
      <Tabs
        defaultActiveKey="tree"
        centered
        size="large"
        className={styles.tabs}
        items={tabItems}
      />
      {/* 右下角浮动按钮 */}
      <button
        className={styles.fab}
        onClick={() => setShowLink(true)}
        title="Show My Referral Link"
        style={{
          background: 'var(--fab-gradient, linear-gradient(135deg, #6366f1 0%, #818cf8 100%))',
          boxShadow: '0 4px 24px rgba(99,102,241,0.18)',
          border: 'none',
          borderRadius: '50%',
          width: 56,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'fixed',
          right: 24,
          bottom: 24,
          zIndex: 1200,
          cursor: 'pointer',
          transition: 'background 0.2s, box-shadow 0.2s',
        }}
      >
        <IoShareSocialOutline size={28} style={{ color: 'var(--fab-icon, #fff)' }} />
      </button>
      {showLink && address && <ReferralLink address={address} />}
    </div>
  );
}
