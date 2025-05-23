'use client';

import React, { useEffect, useState } from 'react';
import { Tree, Select } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { useAccount } from 'wagmi';
import { supabase } from '@/lib/supabase';
import styles from './ReferralTree.module.css';

interface TreeNode extends Omit<DataNode, 'title'> {
  title: React.ReactNode;
  key: string;
  level: number;
  children?: TreeNode[];
  rank: number;
}

interface ReferralNode {
  user_id: string;
  user_name: string;
  parent_id: string | null;
  parent_name: string | null;
  user_rank: number;
  level: number;
  full_path: string;
}

export default function ReferralTree() {
  const { address } = useAccount();
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [rankOptions, setRankOptions] = useState<number[]>([]);
  const [selectedRank, setSelectedRank] = useState<number | null>(null);

  useEffect(() => {
    if (!address) return;

    (async () => {
      try {
        // 1. 获取当前用户信息
        const { data: userRes, error: userError } = await supabase
          .from('users')
          .select('id, username')
          .eq('wallet_address', address)
          .single();

        if (userError || !userRes) {
          console.error('Error fetching user:', userError);
          return;
        }

        // 2. 获取推荐树数据
        const { data: nodes, error: nodesError } = await supabase
          .from('user_referral_tree_view')
          .select('*')
          .ilike('full_path', `%${userRes.username}%`);

        if (nodesError) {
          console.error('Error fetching referral tree:', nodesError);
          return;
        }

        // 3. 处理数据
        const validNodes = (nodes ?? []).filter((node): node is ReferralNode => 
          node.user_id !== null && 
          node.user_name !== null && 
          node.user_rank !== null && 
          node.level !== null
        );

        // 4. 设置等级选项
        const rankOptions = Array.from(
          new Set(validNodes.map(n => n.user_rank))
        ).sort((a, b) => a - b);
        setRankOptions(rankOptions);

        // 5. 构建树结构
        const buildTree = (list: ReferralNode[], parentId: string | null = null): TreeNode[] =>
          list
            .filter((node) =>
              node.parent_id === parentId &&
              (selectedRank == null || node.user_rank === selectedRank)
            )
            .map((node) => ({
              title: (
                <span className={styles.nodeLabel}>
                  {node.user_name}
                  <span className={styles.levelTag}>Lv {node.level}</span>
                  <span className={styles.rankTag}>Rank {node.user_rank}</span>
                </span>
              ),
              key: node.user_id,
              level: node.level,
              rank: node.user_rank,
              children: buildTree(list, node.user_id),
            }));

        // 6. 设置树数据
        setTreeData(buildTree(validNodes, null));
      } catch (error) {
        console.error('Error in referral tree:', error);
      }
    })();
  }, [address, selectedRank]);

  return (
    <div className={styles.treeContainer}>
      <h3 className={styles.title}>My Referral Tree</h3>
      <div style={{ marginBottom: 12 }}>
        <span style={{ marginRight: 8 }}>Filter by Rank:</span>
        <Select
          style={{ width: 120 }}
          value={selectedRank}
          onChange={setSelectedRank}
          allowClear
          placeholder="All"
          options={rankOptions.map(lv => ({ value: lv, label: `Rank ${lv}` }))}
        />
      </div>
      <Tree
        showLine
        defaultExpandAll
        treeData={treeData}
        className={styles.tree}
      />
    </div>
  );
}
