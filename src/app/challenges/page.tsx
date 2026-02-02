import { listEpisodes } from '@/lib/db/episode';
import Link from 'next/link';

export default async function ChallengesPage() {
    const episodes = await listEpisodes();
    const visibleEpisodes = episodes.filter((ep) => ep.status !== 'archived');

    return (
        <div className="min-h-screen bg-[var(--blueprint-bg)] p-6 sm:p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <header className="text-center space-y-4 py-8">
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[var(--blueprint-text)]">
                        CHALLENGES ARCHIVE
                    </h1>
                    <p className="text-lg text-[var(--blueprint-muted)] max-w-2xl mx-auto">
                        Every episode of Ripped or Stamped — from paper selection to final verdict.
                    </p>
                </header>

                {/* Episodes Grid */}
                {visibleEpisodes.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-[var(--blueprint-muted)]">No challenges yet. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {visibleEpisodes.map((episode) => {
                            const isActive =
                                episode.status === 'paper_voting' || episode.status === 'challenges_voting';
                            const statusLabel =
                                episode.status === 'paper_voting'
                                    ? 'PAPER VOTING'
                                    : episode.status === 'challenges_voting'
                                        ? 'CHALLENGES VOTING'
                                        : 'COMPLETED';
                            const statusColor = isActive
                                ? 'bg-[var(--accent)] text-white'
                                : 'bg-green-500/20 text-green-400';

                            return (
                                <Link
                                    key={episode._id.toString()}
                                    href={`/challenges/${episode.slug}`}
                                    className="group block p-6 border border-[var(--blueprint-line)] rounded-xl hover:border-[var(--accent)] transition-all hover:scale-[1.02]"
                                >
                                    <div className="flex items-start justify-between gap-2 mb-4">
                                        <span className="text-sm font-mono text-[var(--accent)]">
                                            #{episode.episodeNumber.toString().padStart(3, '0')}
                                        </span>
                                        <span className={`px-2 py-1 text-xs font-mono rounded ${statusColor}`}>
                                            {statusLabel}
                                        </span>
                                    </div>

                                    <h2 className="text-xl font-bold text-[var(--blueprint-text)] group-hover:text-[var(--accent)] transition-colors">
                                        {episode.operationTitle}
                                    </h2>

                                    <p className="mt-2 text-sm text-[var(--blueprint-muted)] line-clamp-2">
                                        {episode.hook}
                                    </p>

                                    {episode.paperName && (
                                        <div className="mt-4 pt-4 border-t border-[var(--blueprint-line)]">
                                            <p className="text-xs font-mono text-[var(--blueprint-muted)] uppercase">
                                                Selected Paper
                                            </p>
                                            <p className="text-sm text-[var(--accent)] mt-1">{episode.paperName}</p>
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
