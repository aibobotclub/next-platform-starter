import { useAppKit } from '@/hooks/useAppKit';
import styles from "./UserProfileCard.module.css";
import { useEffect, useState } from "react";
import { supabase } from '@/lib/supabase';

interface UserRow {
  username?: string | null;
  rank?: number | null;
}

export default function UserProfileCard() {
  const { address } = useAppKit();
  const [username, setUsername] = useState<string | null>(null);
  const [rank, setRank] = useState<number | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!address) return;
      const { data, error } = await supabase
        .from('users')
        .select('username, rank')
        .eq('wallet_address', address)
        .maybeSingle();
      const user = data as UserRow | null;
      if (!error && user && typeof user === 'object') {
        setUsername(user.username || null);
        setRank(user.rank ?? null);
      } else {
        setUsername(null);
        setRank(null);
      }
    };
    fetchUser();
  }, [address]);

  const avatarLetter = username ? username[0].toUpperCase() : '-';

  return (
    <div className={styles.profileCard}>
      <div className={styles.avatar}>{avatarLetter}</div>
      <div className={styles.info}>
        <div className={styles.userRow}>
          <span className={styles.userLabel}>Username</span>
          <span className={styles.userValue}>{username ?? '-'}</span>
          <span className={styles.userLabel}>Rank</span>
          <span className={styles.userValue}>{rank ?? '-'}</span>
        </div>
      </div>
    </div>
  );
} 