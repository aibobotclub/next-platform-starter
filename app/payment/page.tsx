"use client";

import { useSearchParams } from 'next/navigation';
import PaymentView from '@/components/payment/PaymentView';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // 验证必要参数
    const name = searchParams.get('name');
    const price = searchParams.get('price');
    const desc = searchParams.get('desc');
    const type = searchParams.get('type');

    if (!name || !price || !desc || !type) {
      console.error('[PaymentPage] Missing required parameters:', { name, price, desc, type });
      toast.error("Invalid payment parameters");
      setIsValid(false);
      return;
    }

    setIsValid(true);
  }, [mounted, searchParams]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Invalid Payment</h2>
          <p className="mt-2 text-gray-600">Please check the payment link and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <PaymentView
      name={searchParams.get('name') || ''}
      price={searchParams.get('price') || ''}
      desc={searchParams.get('desc') || ''}
      type={searchParams.get('type') || ''}
    />
  );
} 