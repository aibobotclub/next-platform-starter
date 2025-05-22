"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";
import styles from "./DashboardHome.module.css";
import { useUserStore } from "@/stores/useUserStore";
import UserProfileCard from "./UserProfileCard/UserProfileCard";
import { Card } from "@/components/ui/card";
import SummaryCard from "./summary/SummaryCard";
import DetailDrawer from './summary/DetailDrawer/DetailDrawer';
import BalanceCard from "./summary/balance/BalanceCard";
import TaskProgressCardContainer from './summary/tasks/TastStatsDetails';
import ProductGrid from '../product/ProductGrid';

function ReferralStats() {
  // 示例推荐统计分析
  return (
    <Card className="mb-4">
      <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 8 }}>Referral Analysis</div>
      <div>Referred Users: 12</div>
      <div>Successful Referrals: 8</div>
      <div>Conversion Rate: 66%</div>
      {/* 可扩展为图表、趋势等 */}
    </Card>
  );
}

export default function DashboardHome() {
  const { address } = useAccount();
  const { isRegistered } = useUserStore();
  const [showDetail, setShowDetail] = useState(false);
  const [detailType, setDetailType] = useState<'tasks'|'balance'|'rewards'|'referral'|null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!address) return;
      try {
        await supabase
          .from("users")
          .select("username")
          .eq("wallet_address", address)
          .single();
      } catch (error) {
        toast.error("Failed to fetch user info");
      }
    };
    if (isRegistered) {
      fetchUserData();
    }
  }, [address, isRegistered]);

  const handleDetail = (type: 'tasks'|'balance'|'rewards'|'referral') => {
    setDetailType(type);
    setShowDetail(true);
  };

  return (
    <div className={styles.mainContent}>
      <div className={styles.container}>
        <div className={styles.profileSummaryGroup}>
          <Card className={styles.cardSection}>
            <UserProfileCard />
          </Card>
          <ProductGrid />
          <Card className={`${styles.cardSection} ${styles.summaryCardSection}`}>
            <SummaryCard onDetail={handleDetail} />
          </Card>
        </div>
      </div>
      <DetailDrawer open={showDetail} onClose={() => setShowDetail(false)}>
        {detailType === 'balance' && <Card className={styles.cardSection}><BalanceCard /></Card>}
        {detailType === 'tasks' && <TaskProgressCardContainer />}
        {detailType === 'rewards' && null}
        {detailType === 'referral' && <ReferralStats />}
      </DetailDrawer>
    </div>
  );
} 