'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    LogOut,
    ChevronLeft,
    Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';
import {useLogout} from "@/lib/hooks/userAuth";

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const logoutMutation = useLogout();

    const navItems = [
        {
            title: 'Overview',
            href: '/overview',
            icon: LayoutDashboard,
        },
        {
            title: 'Crowd Entries',
            href: '/entries',
            icon: Users,
        },
    ];

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    return (
        <aside
            className={cn(
                'fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-50',
                collapsed ? 'w-16' : 'w-64'
            )}
        >
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
                    {!collapsed && (
                        <h2 className="text-xl font-bold text-emerald-600">Kloudspot</h2>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCollapsed(!collapsed)}
                        className="ml-auto"
                    >
                        {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                                    isActive
                                        ? 'bg-emerald-50 text-emerald-600'
                                        : 'text-gray-700 hover:bg-gray-100',
                                    collapsed && 'justify-center'
                                )}
                            >
                                <Icon size={20} />
                                {!collapsed && <span className="font-medium">{item.title}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer - Logout */}
                <div className="p-4 border-t border-gray-200">
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                        className={cn(
                            'w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50',
                            collapsed && 'justify-center px-2'
                        )}
                    >
                        <LogOut size={20} />
                        {!collapsed && (
                            <span className="ml-3">
                {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
              </span>
                        )}
                    </Button>
                </div>
            </div>
        </aside>
    );
}