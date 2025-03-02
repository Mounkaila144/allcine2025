// app/dashboard/layout.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BaseLayout } from '@/components/layouts/base-layout';
import { dashboardThemeConfig } from '@/lib/theme-configs';
import { Sidebar } from '@/components/dashboard/sidebar';
import { MobileNavbar } from '@/components/dashboard/mobile-navbar';
import { useAppSelector } from '@/lib/redux/hooks';
import { toast } from 'sonner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) {
            toast.error("Vous devez être connecté pour accéder à cette page.");
            router.push('/');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return (
            <div className="h-screen w-screen gradient-bg flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <BaseLayout
            themeConfig={dashboardThemeConfig}
            className="min-h-screen gradient-bg"
        >
            {/* Mobile Navigation */}
            <div className="md:hidden">
                <MobileNavbar />
                <div className="pt-16">
                    <main className="p-4">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex">
                <Sidebar />
                <main className="flex-1 ml-64 min-h-screen p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </BaseLayout>
    );
}