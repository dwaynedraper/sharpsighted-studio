'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import type { Episode, PaperOption, ChallengeOption, TrapOption, RidiculousOption } from '@/types/voting';

interface VotingData {
    episode: Episode & {
        options: {
            benchmarks: ChallengeOption[];
            traps: (TrapOption & { canSelect?: boolean })[];
            ridiculous: RidiculousOption[];
        };
    } | null;
    userPaperVote: any | null;
    userChallengesVote: any | null;
    canVoteNightmare: boolean;
}

export default function VotingPage() {
    const { data: session, status } = useSession();
    const [data, setData] = useState<VotingData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Paper voting selections
    const [selectedPaper, setSelectedPaper] = useState<string | null>(null);

    // Challenges voting selections
    const [selectedBenchmark, setSelectedBenchmark] = useState<string | null>(null);
    const [selectedTrap, setSelectedTrap] = useState<string | null>(null);
    const [selectedRidiculous, setSelectedRidiculous] = useState<string | null>(null);

    // Ridiculous submission
    const [ridiculousText, setRidiculousText] = useState('');
    const [submittingRidiculous, setSubmittingRidiculous] = useState(false);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/voting/active');
            if (!res.ok) throw new Error('Failed to fetch');
            const json = await res.json();
            setData(json);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const isAuthenticated = status === 'authenticated' && session?.user?.onboardingComplete;
    const episode = data?.episode;
    const isPaperPhase = episode?.status === 'paper_voting';
    const isChallengesPhase = episode?.status === 'challenges_voting';
    const hasVotedPaper = !!data?.userPaperVote;
    const hasVotedChallenges = !!data?.userChallengesVote;

    // Submit paper vote
    const handlePaperSubmit = async () => {
        if (!selectedPaper || !episode) return;
        setSubmitting(true);
        setError(null);

        try {
            const res = await fetch(`/api/voting/${episode._id}/paper`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paperId: selectedPaper }),
            });

            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error || 'Failed to vote');
            }

            await fetchData();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Submit challenges vote
    const handleChallengesSubmit = async () => {
        if (!selectedBenchmark || !selectedTrap || !episode) return;

        // Check if ridiculous is required
        if (episode.ridiculousEnabled && episode.options.ridiculous.length > 0 && !selectedRidiculous) {
            setError('Please select a ridiculous challenge');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const res = await fetch(`/api/voting/${episode._id}/challenges`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    benchmarkId: selectedBenchmark,
                    trapId: selectedTrap,
                    ridiculousId: selectedRidiculous || undefined,
                }),
            });

            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error || 'Failed to vote');
            }

            await fetchData();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Submit ridiculous text
    const handleRidiculousSubmit = async () => {
        if (!ridiculousText.trim() || !episode) return;
        setSubmittingRidiculous(true);

        try {
            const res = await fetch(`/api/voting/${episode._id}/ridiculous/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: ridiculousText.trim() }),
            });

            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error || 'Failed to submit');
            }

            setRidiculousText('');
            await fetchData();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmittingRidiculous(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--blueprint-bg)] p-8">
                <div className="max-w-5xl mx-auto animate-pulse space-y-8">
                    <div className="h-10 bg-[var(--blueprint-line)] rounded w-1/3"></div>
                    <div className="grid gap-6 md:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-64 bg-[var(--blueprint-line)] rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // No episode
    if (!episode) {
        return (
            <div className="min-h-screen bg-[var(--blueprint-bg)] p-8">
                <div className="max-w-5xl mx-auto text-center py-16">
                    <h1 className="text-2xl font-black font-mono text-[var(--blueprint-text)] mb-4">
                        NO ACTIVE VOTES
                    </h1>
                    <p className="text-[var(--blueprint-muted)]">Check back soon for the next episode.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--blueprint-bg)] p-6 sm:p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <header className="text-center space-y-4">
                    <span className="inline-block px-4 py-2 bg-[var(--accent)]/20 text-[var(--accent)] font-mono font-bold text-sm uppercase rounded">
                        EPISODE {episode.episodeNumber}
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--blueprint-text)]">
                        {episode.operationTitle}
                    </h1>
                    <p className="text-lg text-[var(--accent)] font-mono">{episode.hook}</p>
                </header>

                {/* Auth Notice */}
                {!isAuthenticated && (
                    <div className="p-6 border border-[var(--accent)] rounded-lg bg-[var(--accent)]/10 text-center">
                        <p className="text-[var(--blueprint-muted)] mb-4">
                            Sign in to cast your vote and view results.
                        </p>
                        <Link
                            href="/login"
                            className="inline-block px-6 py-3 bg-[var(--accent)] text-white font-bold uppercase rounded hover:opacity-90"
                        >
                            Sign In
                        </Link>
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <div className="p-4 border border-red-500 rounded-lg bg-red-500/10">
                        <p className="text-red-400">{error}</p>
                    </div>
                )}

                {/* =============== PAPER VOTING PHASE =============== */}
                {isPaperPhase && (
                    <section className="space-y-6">
                        <h2 className="text-xl font-bold font-mono uppercase text-[var(--accent)] text-center">
                            SELECT YOUR PAPER
                        </h2>

                        <div className="grid gap-6 md:grid-cols-3">
                            {episode.papers.map((paper) => {
                                const isSelected = selectedPaper === paper.id;
                                const votePercentage = hasVotedPaper
                                    ? Math.round(
                                        (paper.voteCount /
                                            Math.max(1, episode.papers.reduce((sum, p) => sum + p.voteCount, 0))) *
                                        100
                                    )
                                    : null;

                                return (
                                    <VoteCard
                                        key={paper.id}
                                        selected={isSelected}
                                        onClick={() => !hasVotedPaper && isAuthenticated && setSelectedPaper(paper.id)}
                                        disabled={!isAuthenticated || hasVotedPaper}
                                        voted={hasVotedPaper}
                                        percentage={votePercentage}
                                        voteCount={hasVotedPaper ? paper.voteCount : undefined}
                                        isWinner={hasVotedPaper && data?.userPaperVote?.selections?.paperId === paper.id}
                                    >
                                        <h3 className="text-lg font-bold text-[var(--blueprint-text)]">{paper.name}</h3>
                                        <p className="text-sm text-[var(--accent)] mt-1">{paper.weight}</p>
                                        <div className="mt-4 space-y-2 text-xs text-[var(--blueprint-muted)]">
                                            <p><span className="opacity-50">Texture:</span> {paper.textureRef}</p>
                                            <p><span className="opacity-50">Inspiration:</span> {paper.inspirationRef}</p>
                                        </div>
                                    </VoteCard>
                                );
                            })}
                        </div>

                        {/* Submit Button */}
                        {isAuthenticated && !hasVotedPaper && (
                            <div className="text-center">
                                <button
                                    onClick={handlePaperSubmit}
                                    disabled={!selectedPaper || submitting}
                                    className="px-10 py-4 bg-[var(--accent)] text-white font-bold font-mono uppercase text-lg rounded-lg hover:opacity-90 disabled:opacity-40 transition-all"
                                >
                                    {submitting ? 'SUBMITTING...' : 'SUBMIT VOTE'}
                                </button>
                            </div>
                        )}

                        {hasVotedPaper && (
                            <div className="text-center p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                <p className="text-green-400 font-mono">✓ Your paper vote has been recorded</p>
                            </div>
                        )}
                    </section>
                )}

                {/* =============== CHALLENGES VOTING PHASE =============== */}
                {isChallengesPhase && (
                    <section className="space-y-10">
                        {/* Paper Info */}
                        {episode.paperName && (
                            <div className="p-6 border border-[var(--accent)] rounded-lg bg-[var(--accent)]/5 text-center">
                                <p className="text-sm text-[var(--blueprint-muted)] uppercase mb-2">Selected Paper</p>
                                <h3 className="text-2xl font-bold text-[var(--blueprint-text)]">{episode.paperName}</h3>
                                {episode.identity && (
                                    <p className="mt-4 text-sm text-[var(--blueprint-muted)] max-w-2xl mx-auto">
                                        {episode.identity}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* BENCHMARKS */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold font-mono uppercase text-[var(--accent)]">
                                BENCHMARK CHALLENGE
                            </h2>
                            <div className="grid gap-4 md:grid-cols-3">
                                {episode.options.benchmarks.map((opt) => {
                                    const isSelected = selectedBenchmark === opt.id;
                                    const total = episode.options.benchmarks.reduce((s, o) => s + o.voteCount, 0);
                                    const percentage = hasVotedChallenges && total > 0
                                        ? Math.round((opt.voteCount / total) * 100)
                                        : null;

                                    return (
                                        <VoteCard
                                            key={opt.id}
                                            selected={isSelected}
                                            onClick={() => !hasVotedChallenges && isAuthenticated && setSelectedBenchmark(opt.id)}
                                            disabled={!isAuthenticated || hasVotedChallenges}
                                            voted={hasVotedChallenges}
                                            percentage={percentage}
                                            voteCount={hasVotedChallenges ? opt.voteCount : undefined}
                                        >
                                            <h4 className="font-bold text-[var(--blueprint-text)]">{opt.name}</h4>
                                            <p className="mt-2 text-sm text-[var(--blueprint-muted)]">{opt.description}</p>
                                        </VoteCard>
                                    );
                                })}
                            </div>
                        </div>

                        {/* TRAPS */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold font-mono uppercase text-[var(--accent)]">
                                TRAP CHALLENGE
                            </h2>
                            {episode.nightmare && (
                                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <p className="text-sm text-red-400">{episode.nightmare}</p>
                                </div>
                            )}
                            <div className="grid gap-4 md:grid-cols-3">
                                {episode.options.traps.map((opt) => {
                                    const isSelected = selectedTrap === opt.id;
                                    const canSelect = (opt as TrapOption & { canSelect?: boolean }).canSelect !== false;
                                    const total = episode.options.traps.reduce((s, o) => s + o.voteCount, 0);
                                    const percentage = hasVotedChallenges && total > 0
                                        ? Math.round((opt.voteCount / total) * 100)
                                        : null;

                                    return (
                                        <VoteCard
                                            key={opt.id}
                                            selected={isSelected}
                                            onClick={() => {
                                                if (!hasVotedChallenges && isAuthenticated && canSelect) {
                                                    setSelectedTrap(opt.id);
                                                }
                                            }}
                                            disabled={!isAuthenticated || hasVotedChallenges || !canSelect}
                                            voted={hasVotedChallenges}
                                            percentage={percentage}
                                            voteCount={hasVotedChallenges ? opt.voteCount : undefined}
                                            nightmare={opt.isNightmare}
                                            locked={!canSelect}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <h4 className="font-bold text-[var(--blueprint-text)]">{opt.name}</h4>
                                                {opt.isNightmare && (
                                                    <span className="px-2 py-0.5 text-xs font-mono bg-red-500/20 text-red-400 rounded">
                                                        NIGHTMARE
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-2 text-sm text-[var(--blueprint-muted)]">{opt.description}</p>
                                            <p className="mt-2 text-xs text-red-400 italic">"{opt.trap}"</p>
                                            {!canSelect && (
                                                <p className="mt-2 text-xs text-yellow-400">Vote 3+ times to unlock</p>
                                            )}
                                        </VoteCard>
                                    );
                                })}
                            </div>
                        </div>

                        {/* RIDICULOUS (if enabled) */}
                        {episode.ridiculousEnabled && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-bold font-mono uppercase text-[var(--accent)]">
                                    RIDICULOUS CHALLENGE
                                </h2>

                                {/* Submission Form (if not locked) */}
                                {!episode.ridiculousSubmissionsLocked && isAuthenticated && (
                                    <div className="p-4 border border-[var(--blueprint-line)] rounded-lg">
                                        <p className="text-sm text-[var(--blueprint-muted)] mb-2">
                                            Submit your ridiculous challenge (max 120 chars) — {episode.options.ridiculous.length}/5 submitted
                                        </p>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={ridiculousText}
                                                onChange={(e) => setRidiculousText(e.target.value.slice(0, 120))}
                                                placeholder="e.g., Wear a sombrero, one shoe on..."
                                                className="flex-1 px-4 py-2 bg-[var(--blueprint-bg)] border border-[var(--blueprint-line)] rounded font-mono text-sm"
                                            />
                                            <button
                                                onClick={handleRidiculousSubmit}
                                                disabled={!ridiculousText.trim() || submittingRidiculous}
                                                className="px-4 py-2 bg-[var(--accent)] text-white font-bold rounded disabled:opacity-40"
                                            >
                                                {submittingRidiculous ? '...' : 'SUBMIT'}
                                            </button>
                                        </div>
                                        <p className="mt-1 text-xs text-[var(--blueprint-muted)]">{ridiculousText.length}/120</p>
                                    </div>
                                )}

                                {/* Voting Options */}
                                {episode.options.ridiculous.length > 0 && (
                                    <div className="grid gap-4 md:grid-cols-3">
                                        {episode.options.ridiculous.map((opt) => {
                                            const isSelected = selectedRidiculous === opt.id;
                                            const total = episode.options.ridiculous.reduce((s, o) => s + o.voteCount, 0);
                                            const percentage = hasVotedChallenges && total > 0
                                                ? Math.round((opt.voteCount / total) * 100)
                                                : null;

                                            return (
                                                <VoteCard
                                                    key={opt.id}
                                                    selected={isSelected}
                                                    onClick={() => !hasVotedChallenges && isAuthenticated && setSelectedRidiculous(opt.id)}
                                                    disabled={!isAuthenticated || hasVotedChallenges}
                                                    voted={hasVotedChallenges}
                                                    percentage={percentage}
                                                    voteCount={hasVotedChallenges ? opt.voteCount : undefined}
                                                >
                                                    <p className="text-[var(--blueprint-text)]">"{opt.text}"</p>
                                                    <p className="mt-2 text-xs text-[var(--blueprint-muted)]">
                                                        by {opt.submittedByDisplayName}
                                                    </p>
                                                </VoteCard>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Submit Button */}
                        {isAuthenticated && !hasVotedChallenges && (
                            <div className="text-center">
                                <button
                                    onClick={handleChallengesSubmit}
                                    disabled={!selectedBenchmark || !selectedTrap || submitting}
                                    className="px-10 py-4 bg-[var(--accent)] text-white font-bold font-mono uppercase text-lg rounded-lg hover:opacity-90 disabled:opacity-40 transition-all"
                                >
                                    {submitting ? 'SUBMITTING...' : 'SUBMIT VOTE'}
                                </button>
                            </div>
                        )}

                        {hasVotedChallenges && (
                            <div className="text-center p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                <p className="text-green-400 font-mono">✓ Your challenges vote has been recorded</p>
                            </div>
                        )}
                    </section>
                )}

                {/* Episode Closed */}
                {episode.status === 'closed' && (
                    <div className="text-center py-8">
                        <p className="text-[var(--blueprint-muted)] mb-4">Voting has closed for this episode.</p>
                        <Link
                            href={`/challenges/${episode.slug}`}
                            className="inline-block px-6 py-3 bg-[var(--accent)] text-white font-bold uppercase rounded"
                        >
                            View Results →
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

// ==================== VOTE CARD COMPONENT ====================

interface VoteCardProps {
    children: React.ReactNode;
    selected: boolean;
    onClick: () => void;
    disabled: boolean;
    voted: boolean;
    percentage?: number | null;
    voteCount?: number;
    isWinner?: boolean;
    nightmare?: boolean;
    locked?: boolean;
}

function VoteCard({
    children,
    selected,
    onClick,
    disabled,
    voted,
    percentage,
    voteCount,
    isWinner,
    nightmare,
    locked,
}: VoteCardProps) {
    return (
        <div
            onClick={!disabled ? onClick : undefined}
            className={`
        relative p-6 border-2 rounded-xl transition-all duration-200 ease-out
        ${!disabled ? 'cursor-pointer hover:border-[var(--accent)]/50' : 'cursor-default'}
        ${selected
                    ? 'border-[var(--accent)] bg-[var(--accent)]/10 scale-110 shadow-[0_0_30px_var(--accent-glow,rgba(255,100,50,0.4))] z-10'
                    : 'border-[var(--blueprint-line)]'
                }
        ${locked ? 'opacity-50' : ''}
        ${nightmare ? 'border-red-500/30' : ''}
      `}
            style={{
                transform: selected ? 'scale(1.1)' : 'scale(1)',
            }}
        >
            {children}

            {/* Results overlay */}
            {voted && percentage !== null && percentage !== undefined && (
                <div className="mt-4 pt-4 border-t border-[var(--blueprint-line)]">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-bold text-[var(--accent)]">{percentage}%</span>
                        <span className="text-sm text-[var(--blueprint-muted)]">{voteCount} votes</span>
                    </div>
                    <div className="h-2 bg-[var(--blueprint-line)] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[var(--accent)] transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Winner badge */}
            {isWinner && (
                <div className="absolute -top-2 -right-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                    YOUR PICK
                </div>
            )}
        </div>
    );
}
