'use client'
import styles from './OrderCenter.module.css';
interface Props { status: string }
export default function OrderStatusTag({ status }: Props) {
  let className = styles.statusTag;
  let text = status;
  if (status === 'paid' || status === 'success') { className += ' ' + styles.statusPaid; text = 'Paid'; }
  else if (status === 'pending') { className += ' ' + styles.statusPending; text = 'Pending'; }
  else if (status === 'failed') { className += ' ' + styles.statusFailed; text = 'Failed'; }
  else if (status === 'refunded') { className += ' ' + styles.statusRefunded; text = 'Refunded'; }
  else { text = status.charAt(0).toUpperCase() + status.slice(1); }
  return <span className={className}>{text}</span>;
} 