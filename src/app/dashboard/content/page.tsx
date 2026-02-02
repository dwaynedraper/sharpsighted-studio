'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface EpisodeSummary {
    _id: string;
    episodeNumber: number;
    operationTitle: string;
    slug: string;
    status: string;
    paperName: string | null;
    createdAt: string;
}

export default function ContentDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [episodes, setEpisodes] = useState<EpisodeSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');

    const isAdmin = session?.user?.role === 'admin' || session?.user?.role === 'superAdmin';

    useEffect(() => {
        if (status === 'loading') return;
        if (!isAdmin) {
            router.push('/unauthorized');
            return;
        }

        const fetchEpisodes = async () => {
            try {
                const url = filter === 'all' ? '/api/admin/episodes' : `/api/admin/episodes?status=${filter}`;
                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    setEpisodes(data.episodes);
                }
            } catch (err) {
                console.error('Failed to fetch episodes:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchEpisodes();
    }, [status, isAdmin, filter, router]);

    if (status === 'loading' || loading) {
        return (
            <div className="p-8 animate-pulse">
                <div className="h-8 bg-[var(--blueprint-line)] rounded w-1/4 mb-8"></div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 bg-[var(--blueprint-line)] rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    const statusColors: Record<string, string> = {
        paper_voting: 'bg-blue-500/20 text-blue-400',
        challenges_voting: 'bg-purple-500/20 text-purple-400',
        closed: 'bg-green-500/20 text-green-400',
        archived: 'bg-gray-500/20 text-gray-400',
    };

    return (
        <div className="p-6 sm:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-black font-mono text-[var(--blueprint-text)]">
                    CONTENT MANAGEMENT
                </h1>
                <Link
                    href="/dashboard/content/episodes/new"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white font-bold uppercase rounded hover:opacity-90"
                >
                    <span>+</span> NEW PAPER VOTE
                </Link>
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
                {['all', 'paper_voting', 'challenges_voting', 'closed', 'archived'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 text-sm font-mono uppercase rounded transition-colors ${filter === f
                                ? 'bg-[var(--accent)] text-white'
                                : 'bg-[var(--blueprint-line)] text-[var(--blueprint-muted)] hover:text-white'
                            }`}
                    >
                        {f.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* Episodes Table */}
            <div className="border border-[var(--blueprint-line)] rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-[var(--blueprint-line)]">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-mono uppercase text-[var(--blueprint-muted)]">
                                Episode
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-mono uppercase text-[var(--blueprint-muted)]">
                                Operation
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-mono uppercase text-[var(--blueprint-muted)]">
                                Paper
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-mono uppercase text-[var(--blueprint-muted)]">
                                Status
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-mono uppercase text-[var(--blueprint-muted)]">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {episodes.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-[var(--blueprint-muted)]">
                                    No episodes found
                                </td>
                            </tr>
                        ) : (
                            episodes.map((ep) => (
                                <tr key={ep._id} className="border-t border-[var(--blueprint-line)]">
                                    <td className="px-4 py-3 font-mono text-[var(--accent)]">
                                        #{ep.episodeNumber.toString().padStart(3, '0')}
                                    </td>
                                    <td className="px-4 py-3 text-[var(--blueprint-text)]">{ep.operationTitle}</td>
                                    <td className="px-4 py-3 text-[var(--blueprint-muted)]">
                                        {ep.paperName || '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 text-xs font-mono uppercase rounded ${statusColors[ep.status] || ''}`}>
                                            {ep.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Link
                                            href={`/dashboard/content/episodes/${ep._id}`}
                                            className="text-sm text-[var(--accent)] hover:underline"
                                        >
                                            Edit →
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
