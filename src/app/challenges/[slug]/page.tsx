import { getEpisodeBySlug, listEpisodes } from '@/lib/db/episode';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function ChallengesDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const episode = await getEpisodeBySlug(slug);

    if (!episode || episode.status === 'archived') {
        notFound();
    }

    const winningBenchmark = episode.options.benchmarks.find(
        (b) => b.id === episode.results.winningBenchmarkId
    );
    const winningTrap = episode.options.traps.find((t) => t.id === episode.results.winningTrapId);
    const winningRidiculous = episode.options.ridiculous.find(
        (r) => r.id === episode.results.winningRidiculousId
    );

    const totalBenchmarkVotes = episode.options.benchmarks.reduce((s, o) => s + o.voteCount, 0);
    const totalTrapVotes = episode.options.traps.reduce((s, o) => s + o.voteCount, 0);
    const totalRidiculousVotes = episode.options.ridiculous.reduce((s, o) => s + o.voteCount, 0);

    return (
        <div className="min-h-screen bg-[var(--blueprint-bg)]">
            {/* Hero */}
            <header className="relative py-20 px-6 text-center bg-gradient-to-b from-[var(--accent)]/10 to-transparent">
                <span className="inline-block px-4 py-2 bg-[var(--accent)]/20 text-[var(--accent)] font-mono font-bold text-sm uppercase rounded mb-4">
                    EPISODE {episode.episodeNumber}
                </span>
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[var(--blueprint-text)] mb-4">
                    {episode.operationTitle}
                </h1>
                <p className="text-xl text-[var(--accent)] font-mono max-w-2xl mx-auto">
                    {episode.hook}
                </p>
            </header>

            <main className="max-w-5xl mx-auto px-6 pb-20 space-y-16">
                {/* The Paper */}
                {episode.paperName && (
                    <section className="text-center space-y-6">
                        <h2 className="text-sm font-mono uppercase text-[var(--blueprint-muted)]">
                            THE SELECTED PAPER
                        </h2>
                        <div className="p-8 border-2 border-[var(--accent)] rounded-2xl bg-[var(--accent)]/5 max-w-2xl mx-auto">
                            <h3 className="text-3xl font-black text-[var(--blueprint-text)]">
                                {episode.paperName}
                            </h3>
                            {episode.identity && (
                                <p className="mt-6 text-[var(--blueprint-muted)] leading-relaxed">
                                    {episode.identity}
                                </p>
                            )}
                        </div>
                    </section>
                )}

                {/* The Nightmare */}
                {episode.nightmare && (
                    <section className="max-w-3xl mx-auto">
                        <div className="p-6 border border-red-500/30 rounded-xl bg-red-500/5">
                            <h2 className="flex items-center gap-3 text-lg font-bold font-mono uppercase text-red-400 mb-4">
                                <span className="text-2xl">⚠</span> THE NIGHTMARE
                            </h2>
                            <p className="text-[var(--blueprint-muted)] whitespace-pre-line leading-relaxed">
                                {episode.nightmare}
                            </p>
                        </div>
                    </section>
                )}

                {/* Handicap */}
                {episode.handicap && (
                    <section className="max-w-3xl mx-auto text-center">
                        <p className="text-sm font-mono uppercase text-[var(--blueprint-muted)] mb-2">
                            HANDICAP
                        </p>
                        <p className="text-xl text-[var(--accent)] font-bold">{episode.handicap}</p>
                    </section>
                )}

                {/* Voting Results (only show if closed) */}
                {episode.status === 'closed' && (
                    <>
                        {/* Benchmark Winner */}
                        <section className="space-y-6">
                            <h2 className="text-center text-lg font-bold font-mono uppercase text-[var(--accent)]">
                                BENCHMARK CHALLENGE
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {episode.options.benchmarks.map((opt) => {
                                    const isWinner = opt.id === episode.results.winningBenchmarkId;
                                    const percentage =
                                        totalBenchmarkVotes > 0
                                            ? Math.round((opt.voteCount / totalBenchmarkVotes) * 100)
                                            : 0;

                                    return (
                                        <div
                                            key={opt.id}
                                            className={`p-6 rounded-xl border-2 transition-all ${isWinner
                                                    ? 'border-[var(--accent)] bg-[var(--accent)]/10 scale-105 shadow-lg'
                                                    : 'border-[var(--blueprint-line)] opacity-70'
                                                }`}
                                        >
                                            {isWinner && (
                                                <span className="inline-block px-2 py-1 mb-3 text-xs font-mono bg-[var(--accent)] text-white rounded">
                                                    WINNER
                                                </span>
                                            )}
                                            <h3 className="text-lg font-bold text-[var(--blueprint-text)]">{opt.name}</h3>
                                            <p className="mt-2 text-sm text-[var(--blueprint-muted)]">{opt.description}</p>
                                            <div className="mt-4">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-[var(--accent)] font-bold">{percentage}%</span>
                                                    <span className="text-[var(--blueprint-muted)]">{opt.voteCount} votes</span>
                                                </div>
                                                <div className="h-2 bg-[var(--blueprint-line)] rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-[var(--accent)]"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Trap Winner */}
                        <section className="space-y-6">
                            <h2 className="text-center text-lg font-bold font-mono uppercase text-[var(--accent)]">
                                TRAP CHALLENGE
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {episode.options.traps.map((opt) => {
                                    const isWinner = opt.id === episode.results.winningTrapId;
                                    const percentage =
                                        totalTrapVotes > 0
                                            ? Math.round((opt.voteCount / totalTrapVotes) * 100)
                                            : 0;

                                    return (
                                        <div
                                            key={opt.id}
                                            className={`p-6 rounded-xl border-2 transition-all ${isWinner
                                                    ? 'border-[var(--accent)] bg-[var(--accent)]/10 scale-105 shadow-lg'
                                                    : opt.isNightmare
                                                        ? 'border-red-500/30 opacity-70'
                                                        : 'border-[var(--blueprint-line)] opacity-70'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                {isWinner && (
                                                    <span className="inline-block px-2 py-1 text-xs font-mono bg-[var(--accent)] text-white rounded">
                                                        WINNER
                                                    </span>
                                                )}
                                                {opt.isNightmare && (
                                                    <span className="px-2 py-1 text-xs font-mono bg-red-500/20 text-red-400 rounded">
                                                        NIGHTMARE
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-lg font-bold text-[var(--blueprint-text)]">{opt.name}</h3>
                                            <p className="mt-2 text-sm text-[var(--blueprint-muted)]">{opt.description}</p>
                                            <p className="mt-2 text-xs text-red-400 italic">"{opt.trap}"</p>
                                            <div className="mt-4">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-[var(--accent)] font-bold">{percentage}%</span>
                                                    <span className="text-[var(--blueprint-muted)]">{opt.voteCount} votes</span>
                                                </div>
                                                <div className="h-2 bg-[var(--blueprint-line)] rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-[var(--accent)]"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Ridiculous Winner (if enabled) */}
                        {episode.ridiculousEnabled && episode.options.ridiculous.length > 0 && (
                            <section className="space-y-6">
                                <h2 className="text-center text-lg font-bold font-mono uppercase text-[var(--accent)]">
                                    RIDICULOUS CHALLENGE
                                </h2>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {episode.options.ridiculous.map((opt) => {
                                        const isWinner = opt.id === episode.results.winningRidiculousId;
                                        const percentage =
                                            totalRidiculousVotes > 0
                                                ? Math.round((opt.voteCount / totalRidiculousVotes) * 100)
                                                : 0;

                                        return (
                                            <div
                                                key={opt.id}
                                                className={`p-6 rounded-xl border-2 transition-all ${isWinner
                                                        ? 'border-[var(--accent)] bg-[var(--accent)]/10 scale-105 shadow-lg'
                                                        : 'border-[var(--blueprint-line)] opacity-70'
                                                    }`}
                                            >
                                                {isWinner && (
                                                    <span className="inline-block px-2 py-1 mb-3 text-xs font-mono bg-[var(--accent)] text-white rounded">
                                                        WINNER
                                                    </span>
                                                )}
                                                <p className="text-lg text-[var(--blueprint-text)]">"{opt.text}"</p>
                                                <p className="mt-2 text-xs text-[var(--blueprint-muted)]">
                                                    Submitted by {opt.submittedByDisplayName}
                                                </p>
                                                <div className="mt-4">
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="text-[var(--accent)] font-bold">{percentage}%</span>
                                                        <span className="text-[var(--blueprint-muted)]">{opt.voteCount} votes</span>
                                                    </div>
                                                    <div className="h-2 bg-[var(--blueprint-line)] rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-[var(--accent)]"
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}
                    </>
                )}

                {/* In Progress Notice */}
                {episode.status !== 'closed' && (
                    <section className="text-center py-10">
                        <p className="text-[var(--blueprint-muted)] mb-4">
                            {episode.status === 'paper_voting'
                                ? 'Paper voting is in progress...'
                                : 'Challenges voting is in progress...'}
                        </p>
                        <Link
                            href="/voting"
                            className="inline-block px-6 py-3 bg-[var(--accent)] text-white font-bold uppercase rounded"
                        >
                            Cast Your Vote →
                        </Link>
                    </section>
                )}

                {/* Back Link */}
                <div className="text-center">
                    <Link href="/challenges" className="text-[var(--accent)] hover:underline font-mono">
                        ← All Challenges
                    </Link>
                </div>
            </main>
        </div>
    );
}
