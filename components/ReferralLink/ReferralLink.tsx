'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import styles from './ReferralLink.module.css';
import { useTranslation } from 'react-i18next';
import { FaFacebook, FaWhatsapp, FaTelegram, FaTwitter } from 'react-icons/fa';


interface ReferralLinkProps {
  address: string;
  onClose?: () => void;
}

export function ReferralLink({ address, onClose }: ReferralLinkProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const getReferralLink = () => `${window.location.origin}?referral=${address}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getReferralLink());
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = (platform: string) => {
    const link = getReferralLink();
    const text = 'Share this link to invite your friends. When they register using your link, you will receive rewards!';
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`; break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer.php?u=${encodeURIComponent(link)}`; break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`; break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + link)}`; break;
      default: return;
    }
    window.open(shareUrl, 'share', 'width=575,height=400');
  };

  return (
    <div className={styles.referralModal}>
      <button onClick={onClose} style={{position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 24, color: '#6366f1', cursor: 'pointer'}}>×</button>
      <div className={styles.title}>My Referral Link</div>
      <div className={styles.desc}>Share this link to invite your friends. When they register using your link, you will receive rewards!</div>
      <div className={styles.linkBox}>
        <input value={getReferralLink()} readOnly style={{border: 'none', background: 'transparent', color: '#4f46e5', fontWeight: 700, width: '70%'}} />
        <button className={styles.copyBtn} onClick={handleCopy}>Copy</button>
      </div>
      <div className={styles.shareRow}>
        <button className={`${styles.shareBtn} ${styles.facebook}`} onClick={() => handleShare('facebook')}><FaFacebook /></button>
        <button className={`${styles.shareBtn} ${styles.whatsapp}`} onClick={() => handleShare('whatsapp')}><FaWhatsapp /></button>
        <button className={`${styles.shareBtn} ${styles.telegram}`} onClick={() => handleShare('telegram')}><FaTelegram /></button>
        <button className={`${styles.shareBtn} ${styles.twitter}`} onClick={() => handleShare('twitter')}><FaTwitter /></button>
      </div>
    </div>
  );
}
