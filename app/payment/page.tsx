'use client';
import PaymentForm from '@/components/pay/PaymentForm';

export default function PaymentPage() {
  const product = {
    name: 'AIDA ',
    price: '50',
    desc: 'Test Description',
    type: 'Test Type',
  };

  const handleClose = () => {
    // 处理关闭逻辑
  };

  return <PaymentForm product={product} onClose={handleClose} productName={''} productDescription={''} />;
} 