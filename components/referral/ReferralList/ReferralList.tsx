'use client';

import React, { useEffect, useState } from 'react';
import styles from './ReferralList.module.css';
import { useAccount } from 'wagmi';
import { supabase } from '@/lib/supabase';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

interface Referral {
  id: string;
  referred_id: string | null;
  referred_username: string | null;
  referred_wallet_address: string | null;
  referrer_id: string | null;
  referrer_username: string | null;
  referrer_wallet_address: string | null;
}

export default function ReferralList() {
  const { address } = useAccount();
  const [userId, setUserId] = useState<string>('');
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentReferrerId, setCurrentReferrerId] = useState<string>('');
  const [referrerStack, setReferrerStack] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!address) return;
    (async () => {
      setLoading(true);
      setError(null);
      // 查找当前用户id
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('wallet_address', address)
        .single();
      console.log('Current user:', user, userError);
      if (userError || !user || typeof user.id !== 'string') {
        setError('User not found');
        setLoading(false);
        return;
      }
      setUserId(user.id);
      setCurrentReferrerId(user.id);
      // 拉取所有推荐关系
      const { data, error: refError } = await supabase
        .from('referral_list_view')
        .select('*');
      console.log('Referrals data:', data, refError);
      if (refError) {
        setError('Failed to fetch referrals');
        setLoading(false);
        return;
      }
      // 兼容Referral类型
      const mapped = (data || []).map((item: any) => ({
        id: item.referred_id || '',
        referred_id: item.referred_id,
        referred_username: item.username,
        referred_wallet_address: item.referred_wallet,
        referrer_id: item.referrer_id,
        referrer_username: '',
        referrer_wallet_address: item.referrer_wallet,
      }));
      setReferrals(mapped);
      setLoading(false);
    })();
  }, [address]);

  // 当前层的直推
  const directReferrals = referrals.filter(ref =>
    ref.referrer_id === currentReferrerId &&
    ((ref.referred_username && ref.referred_username.includes(search)) ||
      (ref.referred_wallet_address && ref.referred_wallet_address.includes(search)) ||
      !search)
  );
  console.log('Current Referrer:', currentReferrerId, 'Direct Referrals:', directReferrals);

  // 统计每个节点的直推人数
  const referralCountMap: Record<string, number> = {};
  referrals.forEach(ref => {
    if (ref.referrer_id) {
      referralCountMap[ref.referrer_id] = (referralCountMap[ref.referrer_id] || 0) + 1;
    }
  });

  // 点击节点进入下一级
  function handleNodeClick(referredId: string) {
    setReferrerStack(prev => [...prev, currentReferrerId]);
    setCurrentReferrerId(referredId);
    setSearch('');
    console.log('Go to next level, new currentReferrerId:', referredId);
  }

  // 返回上一级
  function handleBack() {
    setReferrerStack(prev => {
      const next = [...prev];
      const last = next.pop();
      if (last) setCurrentReferrerId(last);
      console.log('Back to previous level, new currentReferrerId:', last);
      return next;
    });
    setSearch('');
  }

  return (
    <div className={styles.listContainer}>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search by username or wallet"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #eee' }}
        />
      </div>
      {currentReferrerId !== userId && (
        <button className={styles.backBtn} onClick={handleBack} style={{ marginBottom: 12 }}>
          Back
        </button>
      )}
      {loading ? (
        <div className={styles.empty}>Loading...</div>
      ) : error ? (
        <div className={styles.empty}>{error}</div>
      ) : directReferrals.length === 0 ? (
        <div className={styles.empty}>No direct referrals</div>
      ) : (
        <div>
          {directReferrals.map(ref => (
            <div
              key={ref.referred_id}
              className={styles.nodeCard}
              style={{ display: 'flex', alignItems: 'center', borderRadius: 10, boxShadow: '0 2px 8px #eee', padding: 16, marginBottom: 12, cursor: 'pointer', background: '#fff', border: '1px solid #e0e0e0' }}
              onClick={() => ref.referred_id && handleNodeClick(ref.referred_id)}
            >
              <div style={{ flex: 1 }}>
                <div className={styles.username} style={{ fontWeight: 600, fontSize: 16 }}>{ref.referred_username || 'Unknown'}</div>
                <div className={styles.wallet} style={{ color: '#888', fontSize: 13 }}>{ref.referred_wallet_address}</div>
              </div>
              <div style={{ minWidth: 80, textAlign: 'right', color: '#4a90e2', fontWeight: 500 }}>
                Direct referrals: {referralCountMap[ref.referred_id ?? ''] || 0}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
