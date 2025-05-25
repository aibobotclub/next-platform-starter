'use client'
import { useEffect, useState } from 'react';
import { useAppKit } from '@/hooks/useAppKit';
import { supabase } from '@/lib/supabase';
import styles from './OrderCenter.module.css';
import OrderList from './OrderList';

export default function OrderCenter() {
  const { address } = useAppKit();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    supabase.from('users').select('id').eq('wallet_address', address).single().then(userRes => {
      if (userRes.data && userRes.data.id) {
        const userId = userRes.data.id;
        supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false }).then(res => {
          setOrders(res.data || []);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });
  }, [address]);

  return (
    <div className={styles.orderCard}>
      <div className={styles.header}>Order Center</div>
      {loading ? <div className={styles.empty}>Loading...</div> : <OrderList data={orders} />}
    </div>
  );
} 