'use client'

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { supabase } from '@/lib/supabase';
import { Tabs, Spin, Statistic, Card } from 'antd';
import styles from './RewardCenter.module.css';
import TaskRewardList from './TaskRewardList';
import GlobalDividendRewardList from './GlobalDividendRewardList';
import TeamBonusRewardList from './TeamBonusRewardList';

const rewardTypes = [
  { key: 'task', label: 'task reward', type: 'task' },
  { key: 'global_dividend', label: 'global dividend reward', type: 'global_dividend' },
  { key: 'team_bonus', label: 'team bonus reward', type: 'team_bonus' },
];

export default function RewardCenter() {
  const { address } = useAccount();
  const [loading, setLoading] = useState(true);
  const [rewardData, setRewardData] = useState<Record<string, any[]>>({});
  const [total, setTotal] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState('task');

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    supabase.from('users').select('id').eq('wallet_address', address).single().then(userRes => {
      if (userRes.data && userRes.data.id) {
        const userId = userRes.data.id;
        supabase.from('reward_details').select('*').eq('user_id', userId).then(res => {
          if (res.data) {
            const grouped: Record<string, any[]> = { task: [], global_dividend: [], team_bonus: [] };
            const totalMap: Record<string, number> = { task: 0, global_dividend: 0, team_bonus: 0 };
            res.data.forEach((item: any) => {
              if (grouped[item.type]) {
                grouped[item.type].push(item);
                totalMap[item.type] += item.amount || 0;
              }
            });
            setRewardData(grouped);
            setTotal(totalMap);
          }
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });
  }, [address]);

  return (
    <Card className={styles.rewardCard}>
      <div className={styles.header}>Reward Center</div>
      <div className={styles.statRow}>
        {rewardTypes.map(rt => (
          <div className={styles.statItem} key={rt.key}>
            <div style={{fontSize:14,marginBottom:2}}>{rt.label}</div>
            <div style={{fontSize:18}}>{(total[rt.key] || 0).toFixed(2)} <span style={{fontSize:12}}>USDT</span></div>
          </div>
        ))}
      </div>
      <div className={styles.tabs}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'task',
              label: 'task reward',
              children: loading ? <Spin /> : <TaskRewardList data={rewardData['task'] || []} />,
            },
            {
              key: 'global_dividend',
              label: 'global dividend reward',
              children: loading ? <Spin /> : <GlobalDividendRewardList data={rewardData['global_dividend'] || []} />,
            },
            {
              key: 'team_bonus',
              label: 'team bonus reward',
              children: loading ? <Spin /> : <TeamBonusRewardList data={rewardData['team_bonus'] || []} />,
            },
          ]}
        />
      </div>
    </Card>
  );
} 