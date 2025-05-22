"use client";

import { PaymentView } from '@/components/pay/PaymentView';

export default function PayPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8 text-center">Payment</h1>
      <PaymentView amount={50} />
    </div>
  );
} 