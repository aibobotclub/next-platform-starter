import { useEffect, useState } from 'react';
import { useAppKit } from '@/hooks/useAppKit';
import { supabase } from '@/lib/supabase';
import { Card, Spin } from 'antd';
import styles from './BalanceCard.module.css';

export default function BalanceCard() {
  const { address } = useAppKit();
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<Record<string, number>>({
    total: 0,
    available: 0,
    locked: 0,
    pending: 0
  });

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    supabase.from('users').select('id').eq('wallet_address', address).single().then(userRes => {
      if (userRes.data && userRes.data.id) {
        const userId = userRes.data.id;
        supabase.from('user_balance').select('*').eq('user_id', userId).then(res => {
          if (res.data && res.data.length > 0) {
            const data = res.data[0];
            setBalance({
              total: (data.total_credit || 0) + (data.total_rewards || 0),
              available: data.credit_balance || 0,
              locked: data.reward_balance || 0,
              pending: 0
            });
          }
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });
  }, [address]);

  return (
    <Card className={styles.balanceCard}>
      <div className={styles.header}>Balance Overview</div>
      {loading ? (
        <Spin />
      ) : (
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <div className={styles.label}>Total Balance</div>
            <div className={styles.value}>{balance.total.toFixed(2)} <span className={styles.unit}>USDT</span></div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.label}>Available Balance</div>
            <div className={styles.value}>{balance.available.toFixed(2)} <span className={styles.unit}>USDT</span></div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.label}>Locked Balance</div>
            <div className={styles.value}>{balance.locked.toFixed(2)} <span className={styles.unit}>USDT</span></div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.label}>Pending Balance</div>
            <div className={styles.value}>{balance.pending.toFixed(2)} <span className={styles.unit}>USDT</span></div>
          </div>
        </div>
      )}
    </Card>
  );
} 