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
  rank?: number;
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
      const { data: user, error: userErr } = await supabase
        .from('users')
        .select('id, username, wallet_address, rank')
        .eq('wallet_address', address)
        .single();
      if (userErr || !user || typeof user.id !== 'string') return;
      const userId = user.id;
      // 查询所有下线的level和rank
      const { data: allNodesData, error: allErr } = await supabase
        .from('referral_list_view')
        .select('referred_id, username, level, referrer_id')
        .eq('root_user_id', userId);
      if (allErr || !Array.isArray(allNodesData) || allNodesData.length === 0) return;
      // 查询所有相关用户的rank
      const allUserIds = Array.from(new Set([
        userId,
        ...allNodesData.map((n: any) => n.referred_id)
      ]));
      const { data: userRanks } = await supabase
        .from('users')
        .select('id, rank')
        .in('id', allUserIds);
      const idToRank: Record<string, number> = {};
      (userRanks || []).forEach((u: any) => {
        idToRank[u.id] = u.rank ?? 0;
      });
      // 构建 id->children 映射
      const idToChildren: Record<string, TreeNode[]> = {};
      allNodesData.forEach(item => {
        if (!item.referred_id) return;
        if (item.referrer_id && !idToChildren[item.referrer_id]) idToChildren[item.referrer_id] = [];
        if (item.referrer_id) idToChildren[item.referrer_id].push({ 
          referred_id: item.referred_id,
          username: item.username ?? '',
          level: item.level ?? 0,
          rank: idToRank[item.referred_id] ?? 0,
          children: [] 
        });
      });
      // 递归构建树，增加 path 检查防止环路
      function buildTree(userId: string, level = 0, path: string[] = []): TreeNode | null {
        if (!allNodesData) return null;
        if (path.includes(userId)) return null; // 防止环
        if (level > 10) return null; // 限制最大深度为10层
        let node = allNodesData.find((n: any) => n.referred_id === userId);
        if (!node && userId === user?.id) {
          node = { referred_id: user.id, username: user.username, level: 0, referrer_id: user.id };
        }
        if (!node) return null;
        const children = (idToChildren[userId] || [])
          .map(child => buildTree(child.referred_id, level + 1, [...path, userId]))
          .filter(Boolean) as TreeNode[];
        return {
          referred_id: userId,
          username: node?.username || 'Root',
          level: node?.level ?? level,
          rank: userId && idToRank[userId] !== undefined ? idToRank[userId] : 0,
          children: children,
        };
      }
      // 自动补全根节点
      let rootNode = allNodesData.find((n: any) => n.level === 0);
      if (!rootNode && user) {
        rootNode = {
          referred_id: user.id,
          username: user.username || 'Root',
          level: 0,
          referrer_id: user.id
        };
        allNodesData.unshift(rootNode);
      }
      if (rootNode && typeof rootNode.referred_id === 'string') {
        setTreeData(buildTree(rootNode.referred_id, 0));
      } else {
        setTreeData(null);
      }
    })();
  }, [address]);

  const renderTree = (node: TreeNode | null, depth = 0) => {
    if (!node) return null;
    const isExpanded = expandedNodes.has(node.referred_id);
    const hasChildren = node.children.length > 0;
    return (
      <div
        className={styles.treeLevel}
        style={{ ['--tree-depth' as any]: depth } as React.CSSProperties}
      >
        <div className={styles.treeNodeWrap}>
          <div
            className={styles.treeNode}
            onClick={() => hasChildren && toggleNode(node.referred_id)}
            style={{ cursor: hasChildren ? 'pointer' : 'default' }}
            key={node.referred_id || node.username || Math.random()}
          >
            <span className={styles.rankIcon}>{node.level}</span>
            <span className={styles.address}>{node.username}</span>
            <span className={styles.rankNum}>rank {node.rank ?? 0}</span>
          </div>
          {hasChildren && <div className={styles.verticalLine}></div>}
        </div>
        {isExpanded && hasChildren && (
          <div className={styles.childrenRow}>
            {node.children.map(child => (
              <React.Fragment key={child.referred_id}>
                {renderTree(child, depth + 1)}
              </React.Fragment>
            ))}
          </div>
        )}
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
      {/* <h3 className={styles.title}>{t('My Referral Tree')}</h3> */}
      {treeData ? renderTree(treeData) : <div className="text-center py-8 text-gray-400">{t('No referrals found')}</div>}
    </div>
  );
}
