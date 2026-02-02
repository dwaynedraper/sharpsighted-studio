'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Settings } from 'lucide-react';

export function AdminControlPanel() {
    const { data: session } = useSession();

    const isAdmin = session?.user?.role === 'admin' || session?.user?.role === 'superAdmin';

    if (!isAdmin) return null;

    return (
        <Link
            href="/dashboard"
            className="fixed top-16 right-4 z-40 flex items-center gap-2 px-3 py-2 bg-[#38bdf8] text-black text-xs font-bold uppercase tracking-wider rounded-sm shadow-lg hover:scale-105 transition-transform"
            title="Admin Dashboard"
        >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
        </Link>
    );
}
