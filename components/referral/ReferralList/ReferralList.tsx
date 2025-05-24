'use client';

import React, { useEffect, useState } from 'react';
import styles from './ReferralList.module.css';
import { useAccount } from 'wagmi';
import { supabase } from '@/lib/supabase';

interface Referral {
  referred_id: string;
  username: string | null;
  level: number;
  referrer_username: string | null;
  referred_wallet: string;
}

export default function ReferralList() {
  const { address } = useAccount();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!address) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        // 查找当前用户id
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('wallet_address', address)
          .single();
        if (userError || !user || typeof user.id !== 'string') {
          setError('User not found');
          setLoading(false);
          return;
        }
        // 拉取推荐列表
        const { data, error: refError } = await supabase
          .from('referral_list_view')
          .select('referred_id, username, level, referrer_id, referred_wallet')
          .eq('root_user_id', user.id);
        if (refError) {
          setError('Failed to fetch referrals');
          setLoading(false);
          return;
        }
        // 批量查推荐人用户名
        const refIds = Array.from(new Set((data || []).map(item => item.referrer_id).filter((id): id is string => !!id)));
        let refMap: Record<string, string> = {};
        if (refIds.length > 0) {
          const { data: refUsers } = await supabase
            .from('users')
            .select('id, username')
            .in('id', refIds);
          if (refUsers) {
            refMap = Object.fromEntries(refUsers.map(u => [u.id, u.username ?? '']));
          }
        }
        setReferrals(
          (data || []).map(item => ({
            referred_id: item.referred_id ?? '',
            username: item.username ?? '',
            level: item.level ?? 0,
            referrer_username: refMap[item.referrer_id ?? ''] || '',
            referred_wallet: item.referred_wallet ?? '',
          }))
        );
        setLoading(false);
      } catch (e: any) {
        setError(e.message || 'Unknown error');
        setLoading(false);
      }
    })();
  }, [address]);

  // 搜索过滤
  const filteredReferrals = referrals.filter(ref => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      (ref.username && ref.username.toLowerCase().includes(s)) ||
      (ref.referred_wallet && ref.referred_wallet.toLowerCase().includes(s))
    );
  });

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
      {loading ? (
        <div className={styles.empty}>Loading...</div>
      ) : error ? (
        <div className={styles.empty}>{error}</div>
      ) : filteredReferrals.length === 0 ? (
        <div className={styles.empty}>No referrals found</div>
      ) : (
        filteredReferrals.map(ref => (
          <div
            key={ref.referred_id}
            className={`${styles.userCard} ${styles.cardIndent}`}
            style={{ marginLeft: `${ref.level * 12}px` }}
          >
            <span className={styles.levelTag}>L{ref.level}</span>
            <div className={styles.username}>{ref.username || 'Unknown'}</div>
            <div className={styles.referrer}>Referrer: {ref.referrer_username || 'None'}</div>
            <div className={styles.wallet}>{ref.referred_wallet}</div>
          </div>
        ))
      )}
    </div>
  );
}
