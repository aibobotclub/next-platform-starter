'use client';

import React, { useState } from 'react';
import { Tabs } from 'antd';
import ReferralLink from './ReferralLink/ReferralLink';
import ReferralTree from './ReferralTree/ReferralTree';
import ReferralList from './ReferralList/ReferralList';
import styles from './ReferralPage.module.css';
import { IoShareSocialOutline } from 'react-icons/io5';

export default function ReferralPage() {
  const [showLink, setShowLink] = useState(false);
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
      >
        <IoShareSocialOutline size={32} style={{ color: '#fff' }} />
      </button>
      {showLink && <ReferralLink />}
    </div>
  );
}
