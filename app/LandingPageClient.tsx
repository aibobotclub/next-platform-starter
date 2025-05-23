"use client";
import dynamic from 'next/dynamic';

const LandingPage = dynamic(() => import('@/components/home/LandingPage'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </div>
  ),
});

export default function LandingPageClient() {
  return <LandingPage />;
} 