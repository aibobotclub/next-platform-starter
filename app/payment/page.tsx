'use client';

import { useSearchParams } from 'next/navigation';
import PaymentPage from '@/components/pay/PaymentPage';

export default function Page() {
  const searchParams = useSearchParams();
  
  const productName = searchParams.get('name') || '';
  const productPrice = searchParams.get('price') || '';
  const productDesc = searchParams.get('desc') || '';

  return (
    <PaymentPage
      productName={productName}
      productPrice={productPrice}
      productDesc={productDesc}
    />
  );
} 