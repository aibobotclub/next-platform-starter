import styles from "./BalanceCard.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAccount } from "wagmi";

export default function BalanceCard() {
  const router = useRouter();
  const { address } = useAccount();
  const [reward, setReward] = useState<number>(0);
  const [shopping, setShopping] = useState<number>(0);

  useEffect(() => {
    if (!address) return;
    // 先查 users 表获取 user_id
    supabase
      .from("users")
      .select("id")
      .eq("wallet_address", address.toLowerCase())
      .single()
      .then(async ({ data: user, error }) => {
        if (user && user.id) {
          // 再查 user_balance
          const { data: balance } = await supabase
            .from("user_balance")
            .select("reward_balance, credit_balance")
            .eq("user_id", user.id)
            .single();
          if (balance) {
            setReward(balance.reward_balance ?? 0);
            setShopping(balance.credit_balance ?? 0);
          }
        }
      });
  }, [address]);

  return (
    <div className={styles.balanceCard}>
      <div className={styles.row}>
        <div>
          <div className={styles.label}>Reward Balance</div>
          <div className={styles.value}>{reward} USDT</div>
        </div>
        <button className={styles.actionBtn} onClick={() => router.push("/order")}>Subscribe/Order</button>
      </div>
      <div className={styles.row}>
        <div>
          <div className={styles.label}>Shopping Balance</div>
          <div className={styles.value}>{shopping} USDT</div>
        </div>
      </div>
    </div>
  );
} 