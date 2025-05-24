'use client';

import React, { useEffect, useState } from 'react';
import styles from './ReferralTree.module.css';
import { useAccount } from 'wagmi';
import { supabase } from '@/lib/supabase';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface TreeNode {
  referred_id: string;
  username: string | null;
  level: number;
  children: TreeNode[];
}

export default function ReferralTree() {
  const { address } = useAccount();
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const { t } = useTranslation();

  useEffect(() => {
    if (!address) return;
    (async () => {
      // 查找当前用户id
      const { data: user, error: userErr } = await supabase
        .from('users')
        .select('id, username, wallet_address')
        .eq('wallet_address', address)
        .single();
      if (userErr || !user || typeof user.id !== 'string') return;
      const userId = user.id;
      // 拉取团队所有成员
      const { data: allNodesData, error: allErr } = await supabase
        .from('referral_list_view')
        .select('referred_id, username, level, referrer_id')
        .eq('root_user_id', userId);
      if (allErr || !Array.isArray(allNodesData) || allNodesData.length === 0) return;
      // 构建 id->children 映射
      const idToChildren: Record<string, TreeNode[]> = {};
      allNodesData.forEach(item => {
        if (item.referrer_id && !idToChildren[item.referrer_id]) idToChildren[item.referrer_id] = [];
        if (item.referrer_id) idToChildren[item.referrer_id].push({ 
          referred_id: item.referred_id ?? '',
          username: item.username ?? '',
          level: item.level ?? 0,
          children: [] 
        });
      });
      // 递归构建树，增加 path 检查防止环路
      function buildTree(userId: string, level = 0, path: string[] = []): TreeNode | null {
        if (!allNodesData) return null;
        if (path.includes(userId)) return null; // 防止环
        const node = allNodesData.find((n: any) => n.referred_id === userId);
        const children = (idToChildren[userId] || []).map(child =>
          buildTree(child.referred_id, level + 1, [...path, userId])
        );
        return {
          referred_id: userId,
          username: node?.username || 'Root',
          level: node?.level ?? level,
          children: children.filter(Boolean) as TreeNode[],
        };
      }
      setTreeData(buildTree(userId, 0));
    })();
  }, [address]);

  const renderTree = (node: TreeNode | null, depth = 0) => {
    if (!node) return null;
    const isExpanded = expandedNodes.has(node.referred_id);
    const hasChildren = node.children.length > 0;
    return (
      <div className={styles.treeLevel} style={{ marginLeft: depth * 16 }}>
        <div style={{ position: 'relative' }}>
          <div
            className={styles.treeNode}
            onClick={() => hasChildren && toggleNode(node.referred_id)}
            style={{ cursor: hasChildren ? 'pointer' : 'default' }}
            key={node.referred_id || node.username || Math.random()}
          >
            <div className={styles.address}>{node.username}</div>
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
                {node.children.map(child => renderTree(child, depth + 1))}
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
      {treeData ? renderTree(treeData) : <div className="text-center py-8 text-gray-400">{t('No referrals found')}</div>}
    </div>
  );
}
