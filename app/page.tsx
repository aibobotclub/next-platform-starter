import dynamic from 'next/dynamic';

// 动态导入 LandingPage 组件以避免 SSR 问题
const LandingPage = dynamic(() => import('@/components/home/LandingPage'), {
    ssr: false,
    loading: () => (
        <div className="h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
    ),
});

export default function Page() {
    return <LandingPage />;
}
