"use client";

import { useSearchParams } from 'next/navigation';
import PaymentPage from '@/components/pay/PaymentPage';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function PaymentPageWrapper() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!mounted) return;
    const name = searchParams.get('name');
    const price = searchParams.get('price');
    const desc = searchParams.get('desc');
    if (!name || !price || !desc) {
      toast.error("Invalid payment parameters");
      setIsValid(false);
      return;
    }
    setIsValid(true);
  }, [mounted, searchParams]);

  if (!mounted) return <div>Loading...</div>;
  if (!isValid) return <div>Invalid Payment</div>;

  return (
    <PaymentPage
      productName={searchParams.get('name') || ''}
      productPrice={searchParams.get('price') || ''}
      productDesc={searchParams.get('desc') || ''}
    />
  );
} 