'use client';

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { supabase } from '@/lib/supabase';
import styles from './ReferralList.module.css';

interface Referral {
  id: string;
  username: string;
  level: number;
}

export default function ReferralList() {
  const { address } = useAccount();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) return;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching user with address:', address);
        
        // 1. 先查询用户ID
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('wallet_address', address)
          .single();

        console.log('User query result:', { user, userError });

        if (userError || !user || !user.id) {
          setError('User not found');
          setLoading(false);
          return;
        }

        // 2. 查询直接推荐人（parent_id = user.id）
        const { data: list, error: listError } = await supabase
          .from('user_referral_tree_view')
          .select('user_id, user_name, level')
          .eq('parent_id', user.id)
          // .eq('level', 1) // 如果只要直推，取消注释

        console.log('Referrals query result:', { list, listError });

        if (listError) {
          console.error('Error fetching referrals:', listError);
          setError('Failed to fetch referral data');
          setLoading(false);
          return;
        }

        setReferrals(list ? list.map(item => ({
          id: item.user_id ?? '',
          username: item.user_name ?? '',
          level: item.level ?? 0,
        })) : []);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    })();
  }, [address]);

  if (loading) {
    return <div className={styles.card}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.card}>{error}</div>;
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>My Direct Referrals</h3>

      {referrals.length === 0 ? (
        <div className={styles.empty}>You haven&apos;t referred anyone yet.</div>
      ) : (
        <div>
          {referrals.map((r) => (
            <div key={r.id} className={styles.row}>
              <span className={styles.label}>{r.username}</span>
              <span className={styles.value}>Level {r.level}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
