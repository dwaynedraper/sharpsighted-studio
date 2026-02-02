import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getEpisodeById, incrementPaperVote } from '@/lib/db/episode';
import { createBallot, hasUserVoted } from '@/lib/db/ballot';
import { incrementRosBallotsCast } from '@/lib/db/user';

interface RouteParams {
    params: Promise<{ episodeId: string }>;
}

/**
 * POST /api/voting/[episodeId]/paper
 * Submit a paper vote
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
        if (episode.status !== 'paper_voting') {
            return NextResponse.json({ error: 'Paper voting is not active' }, { status: 400 });
        }

        // Check if already voted
        const alreadyVoted = await hasUserVoted(episodeId, session.user.id, 'paper');
        if (alreadyVoted) {
            return NextResponse.json({ error: 'You have already voted' }, { status: 400 });
        }

        // Validate selection
        const body = await request.json();
        const { paperId } = body;

        if (!paperId || typeof paperId !== 'string') {
            return NextResponse.json({ error: 'paperId is required' }, { status: 400 });
        }

        const validPaper = episode.papers.find((p) => p.id === paperId);
        if (!validPaper) {
            return NextResponse.json({ error: 'Invalid paper selection' }, { status: 400 });
        }

        // Create ballot
        const ballot = await createBallot(episodeId, session.user.id, 'paper', { paperId });

        // Increment vote count
        await incrementPaperVote(episodeId, paperId);

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
            results: updatedEpisode?.papers.map((p) => ({
                id: p.id,
                name: p.name,
                voteCount: p.voteCount,
            })),
        });
    } catch (error) {
        console.error('[api/voting/[episodeId]/paper] Error:', error);
        return NextResponse.json({ error: 'Failed to submit vote' }, { status: 500 });
    }
}
