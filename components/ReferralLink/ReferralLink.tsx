'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { message } from 'antd';
import {
  CopyOutlined,
  UpOutlined,
  DownOutlined,
  LinkOutlined,

} from '@ant-design/icons';
import styles from './ReferralLink.module.css';

interface ReferralLinkProps {
  open: boolean;
  onClose: () => void;
}

export default function ReferralLink({ open, onClose }: ReferralLinkProps) {
  const { address } = useAccount();
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  if (!open) return null;
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://aidabot.club';
  const baseUrl = `${origin}/register?ref=`;
  const referralLink = address ? `${baseUrl}${address}` : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      message.success('Referral link copied!');
    } catch {
      message.error('Failed to copy link.');
    }
  };

  const shareTo = (platform: string) => {
    const encoded = encodeURIComponent(referralLink);
    const text = encodeURIComponent("Join AIDA with my referral link!");

    let url = '';
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encoded}&text=${text}`;
        break;
      case 'telegram':
        url = `https://t.me/share/url?url=${encoded}&text=${text}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${text}%20${encoded}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encoded}`;
        break;
    }
    if (url) window.open(url, '_blank');
  };

  return (
    <div className={styles.card}>
      {/* Header Toggle */}
      <div className={styles.toggleHeader} onClick={() => setExpanded(!expanded)}>
        <LinkOutlined className={styles.icon} />
        <span className={styles.toggleText}>My Referral Link</span>
        {expanded ? <UpOutlined /> : <DownOutlined />}
      </div>

      {/* Collapsible content */}
      {expanded && (
        <div className={styles.content}>
          <p className={styles.description}>
            Share this link to invite others. When they register using your link, you&apos;ll earn rewards!
          </p>

          <div className={styles.linkRow}>
            <input type="text" value={referralLink} readOnly className={styles.input} />
            <button className={styles.copyBtn} onClick={handleCopy}>
              <CopyOutlined />
            </button>
          </div>

          <div className={styles.shareRow}>
            <span className={styles.shareLabel}>Share to:</span>
            <button onClick={() => shareTo('twitter')} className={styles.socialBtn}>Twitter</button>
            <button onClick={() => shareTo('telegram')} className={styles.socialBtn}>Telegram</button>
            <button onClick={() => shareTo('whatsapp')} className={styles.socialBtn}>WhatsApp</button>
            <button onClick={() => shareTo('facebook')} className={styles.socialBtn}>Facebook</button>
          </div>
        </div>
      )}
    </div>
  );
}
