import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getEpisodeById, incrementChallengesVote } from '@/lib/db/episode';
import { createBallot, hasUserVoted, getUserTotalBallotsCast } from '@/lib/db/ballot';
import { incrementRosBallotsCast } from '@/lib/db/user';

interface RouteParams {
    params: Promise<{ episodeId: string }>;
}

/**
 * POST /api/voting/[episodeId]/challenges
 * Submit challenges vote (benchmark, trap, optionally ridiculous)
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const { episodeId } = await params;
        const session = await auth();

        // Auth check
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        if (!session.user.onboardingComplete) {
            return NextResponse.json({ error: 'Onboarding required' }, { status: 403 });
        }

        // Get episode
        const episode = await getEpisodeById(episodeId);
        if (!episode) {
            return NextResponse.json({ error: 'Episode not found' }, { status: 404 });
        }

        // Check phase
        if (episode.status !== 'challenges_voting') {
            return NextResponse.json({ error: 'Challenges voting is not active' }, { status: 400 });
        }

        // Check if already voted
        const alreadyVoted = await hasUserVoted(episodeId, session.user.id, 'challenges');
        if (alreadyVoted) {
            return NextResponse.json({ error: 'You have already voted' }, { status: 400 });
        }

        // Validate selections
        const body = await request.json();
        const { benchmarkId, trapId, ridiculousId } = body;

        if (!benchmarkId || typeof benchmarkId !== 'string') {
            return NextResponse.json({ error: 'benchmarkId is required' }, { status: 400 });
        }

        if (!trapId || typeof trapId !== 'string') {
            return NextResponse.json({ error: 'trapId is required' }, { status: 400 });
        }

        // Validate benchmark
        const validBenchmark = episode.options.benchmarks.find((b) => b.id === benchmarkId);
        if (!validBenchmark) {
            return NextResponse.json({ error: 'Invalid benchmark selection' }, { status: 400 });
        }

        // Validate trap (with nightmare check)
        const validTrap = episode.options.traps.find((t) => t.id === trapId);
        if (!validTrap) {
            return NextResponse.json({ error: 'Invalid trap selection' }, { status: 400 });
        }

        if (validTrap.isNightmare) {
            const userBallots = await getUserTotalBallotsCast(session.user.id);
            if (userBallots < 3) {
                return NextResponse.json(
                    { error: 'You need 3+ votes to select nightmare options' },
                    { status: 403 }
                );
            }
        }

        // Validate ridiculous if provided
        if (ridiculousId) {
            const validRidiculous = episode.options.ridiculous.find((r) => r.id === ridiculousId);
            if (!validRidiculous) {
                return NextResponse.json({ error: 'Invalid ridiculous selection' }, { status: 400 });
            }
        } else if (episode.ridiculousEnabled && episode.options.ridiculous.length > 0) {
            // Ridiculous is required if enabled and has options
            return NextResponse.json({ error: 'ridiculousId is required' }, { status: 400 });
        }

        // Create ballot
        const selections = { benchmarkId, trapId, ridiculousId: ridiculousId || undefined };
        const ballot = await createBallot(episodeId, session.user.id, 'challenges', selections);

        // Increment vote counts
        await incrementChallengesVote(episodeId, benchmarkId, trapId, ridiculousId);

        // Increment user's RoS stats
        await incrementRosBallotsCast(session.user.id);

        // Fetch updated episode for results
        const updatedEpisode = await getEpisodeById(episodeId);

        return NextResponse.json({
            success: true,
            ballot: {
                _id: ballot._id.toString(),
                selections: ballot.selections,
            },
            results: {
                benchmarks: updatedEpisode?.options.benchmarks.map((b) => ({
                    id: b.id,
                    name: b.name,
                    voteCount: b.voteCount,
                })),
                traps: updatedEpisode?.options.traps.map((t) => ({
                    id: t.id,
                    name: t.name,
                    voteCount: t.voteCount,
                })),
                ridiculous: updatedEpisode?.options.ridiculous.map((r) => ({
                    id: r.id,
                    text: r.text,
                    voteCount: r.voteCount,
                })),
            },
        });
    } catch (error) {
        console.error('[api/voting/[episodeId]/challenges] Error:', error);
        return NextResponse.json({ error: 'Failed to submit vote' }, { status: 500 });
    }
}
