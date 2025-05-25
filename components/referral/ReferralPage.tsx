'use client';

import React, { useState } from 'react';
import { Tabs } from 'antd';
import { ReferralLink } from './ReferralLink/ReferralLink';
import ReferralTree from './ReferralTree/ReferralTree';
import ReferralList from './ReferralList/ReferralList';
import styles from './ReferralPage.module.css';
import { IoShareSocialOutline } from 'react-icons/io5';
import { useAppKit } from '@/hooks/useAppKit';

export default function ReferralPage() {
  const [showLink, setShowLink] = useState(false);
  const { address } = useAppKit();
  const tabItems = [
    {
      key: 'tree',
      label: 'Organization',
      children: <ReferralTree />, 
    },
    {
      key: 'list',
      label: 'Referral',
      children: <ReferralList />, 
    },
  ];

  const [activeKey, setActiveKey] = useState('tree');

  return (
    <div className={styles.referralPage}>
      <div className={styles.contentContainer}>
        <h2 className={styles.referralTitle}>My Referral System</h2>
        <Tabs
          defaultActiveKey="tree"
          centered
          size="large"
          className={styles.tabs}
          items={tabItems}
          onChange={setActiveKey}
        />
      </div>
      <button
        className={styles.fab}
        onClick={() => setShowLink(true)}
        title="Show My Referral Link"
      >
        <IoShareSocialOutline size={32} style={{ color: 'var(--fab-icon, #fff)' }} />
      </button>
      {showLink && address && <ReferralLink address={address} onClose={() => setShowLink(false)} />}
    </div>
  );
}
