import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getCurrentEpisode } from '@/lib/db/episode';
import { getUserBallots, getUserTotalBallotsCast } from '@/lib/db/ballot';

/**
 * GET /api/voting/active
 * Returns the current active episode with voting state
 */
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        const episode = await getCurrentEpisode();

        if (!episode) {
            return NextResponse.json({
                episode: null,
                userPaperVote: null,
                userChallengesVote: null,
                canVoteNightmare: false,
            });
        }

        let userPaperVote = null;
        let userChallengesVote = null;
        let canVoteNightmare = false;

        if (session?.user?.id) {
            const ballots = await getUserBallots(episode._id.toString(), session.user.id);
            userPaperVote = ballots.paper;
            userChallengesVote = ballots.challenges;

            // Check if user can vote on nightmare options (3+ total ballots)
            const totalBallots = await getUserTotalBallotsCast(session.user.id);
            canVoteNightmare = totalBallots >= 3;
        }

        // Filter nightmare traps for non-eligible users (if not authenticated or not enough votes)
        const filteredEpisode = {
            ...episode,
            _id: episode._id.toString(),
            options: {
                ...episode.options,
                traps: episode.options.traps.map((trap) => ({
                    ...trap,
                    // Hide nightmare traps from non-eligible users (but keep them in array with flag)
                    canSelect: !trap.isNightmare || canVoteNightmare,
                })),
            },
        };

        return NextResponse.json({
            episode: filteredEpisode,
            userPaperVote,
            userChallengesVote,
            canVoteNightmare,
        });
    } catch (error) {
        console.error('[api/voting/active] Error:', error);
        return NextResponse.json({ error: 'Failed to fetch voting data' }, { status: 500 });
    }
}
