'use client';

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { supabase } from '@/lib/supabase';
import styles from './ReferralList.module.css';

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
        if (userError || !user || !user.id) {
          setError('User not found');
          setLoading(false);
          return;
        }
        // 查询团队成员
        const { data: list, error: listError } = await supabase
          .from('referral_list_view')
          .select('referred_id, username, level, referrer_id, referred_wallet')
          .eq('root_user_id', user.id);
        if (listError) {
          setError('Failed to fetch referral data');
          setLoading(false);
          return;
        }
        // 查询推荐人用户名
        let refMap: Record<string, string | null> = {};
        if (list && list.length > 0) {
          const refIds = Array.from(new Set(list.map(item => item.referrer_id).filter((id): id is string => !!id)));
          if (refIds.length > 0) {
            const { data: refUsers } = await supabase
              .from('users')
              .select('id, username')
              .in('id', refIds);
            if (refUsers) {
              refMap = Object.fromEntries(refUsers.map(u => [u.id, u.username]));
            }
          }
        }
        setReferrals(list ? list.map(item => ({
          referred_id: item.referred_id ?? '',
          username: item.username,
          level: item.level ?? 0,
          referrer_username: refMap[item.referrer_id ?? ''] || null,
          referred_wallet: item.referred_wallet ?? '',
        })) : []);
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    })();
  }, [address]);

  const filtered = referrals.filter(r =>
    !search ||
    (r.username && r.username.toLowerCase().includes(search.toLowerCase())) ||
    (r.referred_wallet && r.referred_wallet.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>My Team Referrals</h3>
      <input
        type="text"
        placeholder="Search username or wallet..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
      />
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>No referrals found.</div>
      ) : (
        <div>
          {filtered.map((r) => (
            <div key={r.referred_id} className={styles.row}>
              <span className={styles.label}>{r.username} ({r.referred_wallet.slice(0, 8)}...)</span>
              <span className={styles.value}>Level {r.level}</span>
              <span className={styles.label}>Referrer: {r.referrer_username || 'Root'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
