'use client';

import { Sidebar } from '@/components/sidebar';
import { SiteSelector } from '@/components/site-selector';
import { SiteProvider } from '@/lib/site-context';
import { useSocket } from '@/lib/hooks/useSocket';

function DashboardContent({ children }: { children: React.ReactNode }) {
    useSocket();

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <main className="ml-64 transition-all duration-300">
                {/* Header with Site Selector */}
                <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Crowd Solutions
                        </h2>
                        <SiteSelector />
                    </div>
                </div>

                {/* Page Content */}
                <div>{children}</div>
            </main>
        </div>
    );
}

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    return (
        <SiteProvider>
            <DashboardContent>{children}</DashboardContent>
        </SiteProvider>
    );
}
