"use client";

import { useState, useEffect } from "react";
import { useAppKit } from '@/hooks/useAppKit';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";
import styles from "./DashboardHome.module.css";
import { useUserStore } from "@/stores/useUserStore";
import UserProfileCard from "../UserProfileCard/UserProfileCard";
import { Card } from "@/components/ui/card";
import SummaryCard from "./summary/SummaryCard";
import DetailDrawer from './summary/DetailDrawer/DetailDrawer';
import BalanceCard from "./summary/balance/BalanceCard";
import TaskProgressCardContainer from './summary/tasks/TastStatsDetails';
import ProductGrid from '../product/ProductGrid';
import RewardStats from "./summary/rewards/RewardStats";
import { ReferralLink } from '@/components/ReferralLink/ReferralLink';

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
  const { address } = useAppKit();
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
      {/* 其他详情用右侧抽屉，referral用全局居中弹窗 */}
      {detailType === 'referral' && showDetail ? (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 72,
        }}>
          <div style={{maxWidth: 420, width: '95vw', marginBottom: 72}}>
            <ReferralLink address={address || ''} onClose={() => setShowDetail(false)} />
          </div>
        </div>
      ) : (
        <DetailDrawer open={showDetail && detailType !== 'referral'} onClose={() => setShowDetail(false)} title={
          detailType === 'rewards' ? 'Reward Details' :
          detailType === 'balance' ? 'Balance Details' :
          detailType === 'tasks' ? 'Task Details' : undefined
        }>
          {detailType === 'balance' && <Card className={styles.cardSection}><BalanceCard /></Card>}
          {detailType === 'tasks' && <TaskProgressCardContainer />}
          {detailType === 'rewards' && <RewardStats />}
        </DetailDrawer>
      )}
    </div>
  );
} 