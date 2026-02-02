'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function MainSiteBadge() {
    const mainSiteUrl = process.env.NEXT_PUBLIC_MAIN_SITE_URL || 'https://sharpsighted.studio';

    return (
        <Link
            href={mainSiteUrl}
            className="fixed top-16 left-4 z-40 flex items-center gap-2 px-3 py-2 bg-[var(--blueprint-bg)] border border-[var(--blueprint-line)] text-[var(--blueprint-text)] text-xs font-bold font-mono uppercase tracking-wider rounded-sm shadow-lg hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            title="Back to Main Site"
        >
            <ArrowLeft className="w-4 h-4" />
            <span>Main Site</span>
        </Link>
    );
}
