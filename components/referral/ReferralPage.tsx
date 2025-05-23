'use client';

import React, { useState } from 'react';
import { Tabs } from 'antd';
import ReferralLink from './ReferralLink/ReferralLink';
import ReferralTree from './ReferralTree/ReferralTree';
import ReferralList from './ReferralList/ReferralList';
import styles from './ReferralPage.module.css';

export default function ReferralPage() {
  const [activeKey, setActiveKey] = useState('link');

  const tabItems = [
    {
      key: 'link',
      label: '🔗 My Referral Link',
      children: <ReferralLink />,
    },
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
        activeKey={activeKey}
        onChange={setActiveKey}
        centered
        size="large"
        className={styles.tabs}
        items={tabItems}
      />
    </div>
  );
}
