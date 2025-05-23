'use client';

import React, { useEffect, useState } from 'react';
import { Tree, Select } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { useAccount } from 'wagmi';
import { supabase } from '@/lib/supabase';
import styles from './ReferralTree.module.css';
import { FaStar, FaUser } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface TreeNode {
  user_id: string;
  user_name: string;
  user_rank: number;
  level: number;
  children: TreeNode[];
}

export default function ReferralTree() {
  const { address } = useAccount();
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [allNodes, setAllNodes] = useState<any[]>([]);
  const [rankOptions, setRankOptions] = useState<number[]>([]);
  const [selectedRank, setSelectedRank] = useState<number | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!address) return;
    (async () => {
      const { data: userRes, error: userErr } = await supabase
        .from('users')
        .select('id, username, wallet_address, user_rank, level')
        .eq('wallet_address', address)
        .single();

      const user = userRes as { id: string; username: string; wallet_address: string; user_rank: number; level: number } | null;
      if (userErr || !user || typeof user.id !== 'string') return;
      const userId = user.id;
      const { data: allNodesData, error: allErr } = await supabase
        .from('user_referral_tree_view')
        .select('*');
      if (allErr || !Array.isArray(allNodesData) || allNodesData.length === 0) return;
      setAllNodes(allNodesData);
      // rank 筛选项
      setRankOptions(Array.from(new Set(allNodesData.map((n: any) => n.user_rank))).sort((a, b) => a - b));
      // 构建树
      function buildTree(parentId: string): TreeNode | null {
        const node = allNodesData!.find((n: any) => n.user_id === parentId);
        if (!node) return null;
        // rank筛选：只显示selectedRank及其下级
        if (selectedRank !== null && node.user_rank !== selectedRank && node.parent_id !== null) return null;
        const children = allNodesData!
          .filter((n: any) => n.parent_id === parentId)
          .map((child: any) => buildTree(child.user_id))
          .filter(Boolean) as TreeNode[];
        return {
          user_id: node.user_id || '',
          user_name: node.user_name || '',
          user_rank: node.user_rank || 0,
          level: node.level || 0,
          children,
        };
      }
      setTreeData(buildTree(userId));
    })();
  }, [address, selectedRank]);

  const renderTree = (node: TreeNode | null) => {
    if (!node) return null;
    const isExpanded = expandedNodes.has(node.user_id);
    const hasChildren = node.children.length > 0;
    return (
      <div className={styles.treeLevel}>
        <div style={{ position: 'relative' }}>
          <div
            className={styles.treeNode}
            onClick={() => hasChildren && toggleNode(node.user_id)}
            style={{ cursor: hasChildren ? 'pointer' : 'default' }}
          >
            <div className={styles.address}>{node.user_name || node.user_id}</div>
            <div>
              <FaUser />
              <span style={{marginLeft: 8, color: '#6366f1', fontWeight: 600}}>{t('Rank')} {node.user_rank}</span>
            </div>
            <div className={styles.volume}>{t('Level')}. {node.level}</div>
          </div>
          {hasChildren && <div className={styles.treeLine}></div>}
          <AnimatePresence>
            {isExpanded && hasChildren && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {node.children.map(child => renderTree(child))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  const toggleNode = (key: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className={styles.treeContainer}>
      <h3 className={styles.title}>{t('My Referral Tree')}</h3>
      <div style={{ marginBottom: 12 }}>
        <span style={{ marginRight: 8 }}>{t('Filter by Rank')}:</span>
        <select
          style={{ minWidth: 120, padding: 4, borderRadius: 6 }}
          value={selectedRank ?? ''}
          onChange={e => setSelectedRank(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">{t('All')}</option>
          {rankOptions.map(lv => (
            <option key={lv} value={lv}>{t('Rank')} {lv}</option>
          ))}
        </select>
      </div>
      {treeData ? renderTree(treeData) : <div className="text-center py-8 text-gray-400">{t('No referrals found')}</div>}
    </div>
  );
}
