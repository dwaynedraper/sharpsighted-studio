'use client';

import { useEffect, useState, use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Episode, ChallengeOption, TrapOption } from '@/types/voting';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EpisodeEditorPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const episodeId = resolvedParams.id;
    const { data: session, status } = useSession();
    const router = useRouter();

    const [episode, setEpisode] = useState<Episode | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Edit form state
    const [identity, setIdentity] = useState('');
    const [nightmare, setNightmare] = useState('');
    const [handicap, setHandicap] = useState('');
    const [ridiculousEnabled, setRidiculousEnabled] = useState(false);

    // New option forms
    const [newBenchmark, setNewBenchmark] = useState({ name: '', description: '' });
    const [newTrap, setNewTrap] = useState({ name: '', description: '', trap: '', isNightmare: false });

    const isAdmin = session?.user?.role === 'admin' || session?.user?.role === 'superAdmin';
    const isSuperAdmin = session?.user?.role === 'superAdmin';

    const fetchEpisode = async () => {
        try {
            const res = await fetch(`/api/admin/episodes/${episodeId}`);
            if (res.ok) {
                const data = await res.json();
                setEpisode(data.episode);
                setIdentity(data.episode.identity || '');
                setNightmare(data.episode.nightmare || '');
                setHandicap(data.episode.handicap || '');
                setRidiculousEnabled(data.episode.ridiculousEnabled || false);
            }
        } catch (err) {
            console.error('Failed to fetch episode:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === 'loading') return;
        if (!isAdmin) {
            router.push('/unauthorized');
            return;
        }
        fetchEpisode();
    }, [status, isAdmin, episodeId, router]);

    const handleUpdateMeta = async () => {
        setError(null);
        setSuccess(null);
        setSaving(true);

        try {
            const res = await fetch(`/api/admin/episodes/${episodeId}/challenges`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identity, nightmare, handicap, ridiculousEnabled }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update');
            }

            setSuccess('Metadata updated');
            await fetchEpisode();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleAddBenchmark = async () => {
        if (!newBenchmark.name.trim() || !newBenchmark.description.trim()) return;
        setError(null);
        setSaving(true);

        try {
            const res = await fetch(`/api/admin/episodes/${episodeId}/challenges`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'benchmark', optionData: newBenchmark }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to add');
            }

            setNewBenchmark({ name: '', description: '' });
            await fetchEpisode();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleAddTrap = async () => {
        if (!newTrap.name.trim() || !newTrap.description.trim() || !newTrap.trap.trim()) return;
        setError(null);
        setSaving(true);

        try {
            const res = await fetch(`/api/admin/episodes/${episodeId}/challenges`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'trap', optionData: newTrap }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to add');
            }

            setNewTrap({ name: '', description: '', trap: '', isNightmare: false });
            await fetchEpisode();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleClosePaperVote = async () => {
        if (!confirm('Are you sure you want to close paper voting and determine the winner?')) return;
        setError(null);
        setSaving(true);

        try {
            const res = await fetch(`/api/admin/episodes/${episodeId}/close-paper-vote`, {
                method: 'POST',
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to close');
            }

            setSuccess('Paper voting closed. Winner selected!');
            await fetchEpisode();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleCloseChallenges = async () => {
        if (!confirm('Are you sure you want to close challenges voting and finalize results?')) return;
        setError(null);
        setSaving(true);

        try {
            const res = await fetch(`/api/admin/episodes/${episodeId}/close-challenges`, {
                method: 'POST',
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to close');
            }

            setSuccess('Challenges voting closed. Results finalized!');
            await fetchEpisode();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="p-8 animate-pulse">
                <div className="h-8 bg-[var(--blueprint-line)] rounded w-1/3 mb-8"></div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 bg-[var(--blueprint-line)] rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!episode) {
        return (
            <div className="p-8 text-center">
                <p className="text-[var(--blueprint-muted)]">Episode not found</p>
                <Link href="/dashboard/content" className="text-[var(--accent)] hover:underline">
                    ← Back to Content
                </Link>
            </div>
        );
    }

    const statusColors: Record<string, string> = {
        paper_voting: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        challenges_voting: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        closed: 'bg-green-500/20 text-green-400 border-green-500/30',
        archived: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };

    return (
        <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <Link href="/dashboard/content" className="text-sm text-[var(--blueprint-muted)] hover:text-white">
                        ← Back to Content
                    </Link>
                    <h1 className="text-2xl font-black font-mono text-[var(--blueprint-text)] mt-2">
                        EPISODE #{episode.episodeNumber.toString().padStart(3, '0')}
                    </h1>
                    <p className="text-lg text-[var(--accent)]">{episode.operationTitle}</p>
                </div>
                <span className={`px-4 py-2 text-sm font-mono uppercase rounded border ${statusColors[episode.status]}`}>
                    {episode.status.replace('_', ' ')}
                </span>
            </div>

            {/* Alerts */}
            {error && (
                <div className="p-4 border border-red-500 rounded-lg bg-red-500/10">
                    <p className="text-red-400">{error}</p>
                </div>
            )}
            {success && (
                <div className="p-4 border border-green-500 rounded-lg bg-green-500/10">
                    <p className="text-green-400">{success}</p>
                </div>
            )}

            {/* Phase Controls */}
            {isSuperAdmin && (
                <div className="p-4 border border-[var(--blueprint-line)] rounded-lg flex flex-wrap gap-4">
                    <span className="text-sm text-[var(--blueprint-muted)]">Phase Controls:</span>
                    {episode.status === 'paper_voting' && (
                        <button
                            onClick={handleClosePaperVote}
                            disabled={saving}
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-40"
                        >
                            Close Paper Vote
                        </button>
                    )}
                    {episode.status === 'challenges_voting' && (
                        <button
                            onClick={handleCloseChallenges}
                            disabled={saving}
                            className="px-4 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 disabled:opacity-40"
                        >
                            Close Challenges Vote
                        </button>
                    )}
                </div>
            )}

            {/* Paper Results (if paper phase closed) */}
            {episode.paperName && (
                <section className="p-6 border border-[var(--accent)] rounded-lg bg-[var(--accent)]/5">
                    <h2 className="text-lg font-bold font-mono uppercase text-[var(--accent)] mb-4">
                        WINNING PAPER
                    </h2>
                    <p className="text-xl text-[var(--blueprint-text)]">{episode.paperName}</p>
                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                        {episode.papers.map((p) => (
                            <div
                                key={p.id}
                                className={`p-3 rounded border ${p.id === episode.winningPaperId
                                        ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                                        : 'border-[var(--blueprint-line)]'
                                    }`}
                            >
                                <p className="font-bold">{p.name}</p>
                                <p className="text-sm text-[var(--blueprint-muted)]">{p.voteCount} votes</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Challenges Editor (only if in challenges phase or closed) */}
            {(episode.status === 'challenges_voting' || episode.status === 'closed') && (
                <>
                    {/* Paper Metadata */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-bold font-mono uppercase text-[var(--accent)]">
                            PAPER DESCRIPTION
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono uppercase text-[var(--blueprint-muted)] mb-2">
                                    Identity (what makes this paper special)
                                </label>
                                <textarea
                                    value={identity}
                                    onChange={(e) => setIdentity(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-[var(--blueprint-bg)] border border-[var(--blueprint-line)] rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono uppercase text-[var(--blueprint-muted)] mb-2">
                                    Nightmare (the difficulty / gotchas)
                                </label>
                                <textarea
                                    value={nightmare}
                                    onChange={(e) => setNightmare(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-[var(--blueprint-bg)] border border-[var(--blueprint-line)] rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono uppercase text-[var(--blueprint-muted)] mb-2">
                                    Handicap (optional extra constraint)
                                </label>
                                <input
                                    type="text"
                                    value={handicap}
                                    onChange={(e) => setHandicap(e.target.value)}
                                    className="w-full px-4 py-3 bg-[var(--blueprint-bg)] border border-[var(--blueprint-line)] rounded"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="ridiculousEnabled"
                                    checked={ridiculousEnabled}
                                    onChange={(e) => setRidiculousEnabled(e.target.checked)}
                                    className="w-5 h-5"
                                />
                                <label htmlFor="ridiculousEnabled" className="text-sm text-[var(--blueprint-muted)]">
                                    Enable Ridiculous Challenge (user submissions)
                                </label>
                            </div>
                            <button
                                onClick={handleUpdateMeta}
                                disabled={saving}
                                className="px-6 py-2 bg-[var(--accent)] text-white font-bold uppercase rounded disabled:opacity-40"
                            >
                                {saving ? 'SAVING...' : 'SAVE METADATA'}
                            </button>
                        </div>
                    </section>

                    {/* Benchmarks */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-bold font-mono uppercase text-[var(--accent)]">
                            BENCHMARKS ({episode.options.benchmarks.length})
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {episode.options.benchmarks.map((opt) => (
                                <div
                                    key={opt.id}
                                    className={`p-4 border rounded-lg ${episode.results.winningBenchmarkId === opt.id
                                            ? 'border-green-500 bg-green-500/10'
                                            : 'border-[var(--blueprint-line)]'
                                        }`}
                                >
                                    <h4 className="font-bold">{opt.name}</h4>
                                    <p className="text-sm text-[var(--blueprint-muted)] mt-1">{opt.description}</p>
                                    <p className="text-xs text-[var(--accent)] mt-2">{opt.voteCount} votes</p>
                                </div>
                            ))}
                            {/* Add New */}
                            <div className="p-4 border border-dashed border-[var(--blueprint-line)] rounded-lg space-y-2">
                                <input
                                    type="text"
                                    value={newBenchmark.name}
                                    onChange={(e) => setNewBenchmark({ ...newBenchmark, name: e.target.value })}
                                    placeholder="Benchmark Name"
                                    className="w-full px-3 py-2 bg-[var(--blueprint-bg)] border border-[var(--blueprint-line)] rounded text-sm"
                                />
                                <textarea
                                    value={newBenchmark.description}
                                    onChange={(e) => setNewBenchmark({ ...newBenchmark, description: e.target.value })}
                                    placeholder="Description"
                                    rows={2}
                                    className="w-full px-3 py-2 bg-[var(--blueprint-bg)] border border-[var(--blueprint-line)] rounded text-sm"
                                />
                                <button
                                    onClick={handleAddBenchmark}
                                    disabled={saving || !newBenchmark.name.trim()}
                                    className="w-full px-4 py-2 bg-[var(--accent)] text-white text-sm rounded disabled:opacity-40"
                                >
                                    + ADD BENCHMARK
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Traps */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-bold font-mono uppercase text-[var(--accent)]">
                            TRAPS ({episode.options.traps.length})
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {episode.options.traps.map((opt) => (
                                <div
                                    key={opt.id}
                                    className={`p-4 border rounded-lg ${episode.results.winningTrapId === opt.id
                                            ? 'border-green-500 bg-green-500/10'
                                            : opt.isNightmare
                                                ? 'border-red-500/30'
                                                : 'border-[var(--blueprint-line)]'
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="font-bold">{opt.name}</h4>
                                        {opt.isNightmare && (
                                            <span className="px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded">
                                                NIGHTMARE
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-[var(--blueprint-muted)] mt-1">{opt.description}</p>
                                    <p className="text-xs text-red-400 mt-1 italic">"{opt.trap}"</p>
                                    <p className="text-xs text-[var(--accent)] mt-2">{opt.voteCount} votes</p>
                                </div>
                            ))}
                            {/* Add New */}
                            <div className="p-4 border border-dashed border-[var(--blueprint-line)] rounded-lg space-y-2">
                                <input
                                    type="text"
                                    value={newTrap.name}
                                    onChange={(e) => setNewTrap({ ...newTrap, name: e.target.value })}
                                    placeholder="Trap Name"
                                    className="w-full px-3 py-2 bg-[var(--blueprint-bg)] border border-[var(--blueprint-line)] rounded text-sm"
                                />
                                <textarea
                                    value={newTrap.description}
                                    onChange={(e) => setNewTrap({ ...newTrap, description: e.target.value })}
                                    placeholder="Description"
                                    rows={2}
                                    className="w-full px-3 py-2 bg-[var(--blueprint-bg)] border border-[var(--blueprint-line)] rounded text-sm"
                                />
                                <input
                                    type="text"
                                    value={newTrap.trap}
                                    onChange={(e) => setNewTrap({ ...newTrap, trap: e.target.value })}
                                    placeholder="The trap/gotcha"
                                    className="w-full px-3 py-2 bg-[var(--blueprint-bg)] border border-[var(--blueprint-line)] rounded text-sm"
                                />
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isNightmare"
                                        checked={newTrap.isNightmare}
                                        onChange={(e) => setNewTrap({ ...newTrap, isNightmare: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor="isNightmare" className="text-xs text-[var(--blueprint-muted)]">
                                        Nightmare (veterans only)
                                    </label>
                                </div>
                                <button
                                    onClick={handleAddTrap}
                                    disabled={saving || !newTrap.name.trim()}
                                    className="w-full px-4 py-2 bg-[var(--accent)] text-white text-sm rounded disabled:opacity-40"
                                >
                                    + ADD TRAP
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Ridiculous */}
                    {ridiculousEnabled && (
                        <section className="space-y-4">
                            <h2 className="text-lg font-bold font-mono uppercase text-[var(--accent)]">
                                RIDICULOUS ({episode.options.ridiculous.length}/5)
                            </h2>
                            {episode.options.ridiculous.length > 0 ? (
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {episode.options.ridiculous.map((opt) => (
                                        <div
                                            key={opt.id}
                                            className={`p-4 border rounded-lg ${episode.results.winningRidiculousId === opt.id
                                                    ? 'border-green-500 bg-green-500/10'
                                                    : 'border-[var(--blueprint-line)]'
                                                }`}
                                        >
                                            <p className="text-[var(--blueprint-text)]">"{opt.text}"</p>
                                            <p className="text-xs text-[var(--blueprint-muted)] mt-2">
                                                by {opt.submittedByDisplayName}
                                            </p>
                                            <p className="text-xs text-[var(--accent)] mt-1">{opt.voteCount} votes</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[var(--blueprint-muted)]">
                                    Waiting for user submissions...
                                </p>
                            )}
                            {episode.ridiculousSubmissionsLocked && (
                                <p className="text-sm text-yellow-400">Submissions locked (5/5)</p>
                            )}
                        </section>
                    )}
                </>
            )}

            {/* Paper Voting Status (show papers if still voting) */}
            {episode.status === 'paper_voting' && (
                <section className="space-y-4">
                    <h2 className="text-lg font-bold font-mono uppercase text-[var(--accent)]">
                        PAPER VOTING IN PROGRESS
                    </h2>
                    <div className="grid gap-4 md:grid-cols-3">
                        {episode.papers.map((p, i) => (
                            <div key={p.id} className="p-4 border border-[var(--blueprint-line)] rounded-lg">
                                <span className="text-sm font-mono text-[var(--accent)]">
                                    PAPER {String.fromCharCode(65 + i)}
                                </span>
                                <h3 className="font-bold mt-1">{p.name}</h3>
                                <p className="text-sm text-[var(--blueprint-muted)]">{p.weight}</p>
                                <p className="text-sm text-[var(--accent)] mt-2">{p.voteCount} votes</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
