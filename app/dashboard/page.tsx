"use client";
import dynamic from "next/dynamic";

const DashboardHome = dynamic(() => import("@/components/dashboard/DashboardHome"), {
  ssr: false,
  loading: () => <div className="h-screen flex items-center justify-center text-xl">加载中...</div>
});

export default function DashboardPage() {
  return <DashboardHome />;
} 