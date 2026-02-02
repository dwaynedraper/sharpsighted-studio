import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getEpisodeById, addRidiculousOption } from '@/lib/db/episode';
import { getUserByEmail } from '@/lib/db/user';

interface RouteParams {
    params: Promise<{ episodeId: string }>;
}

/**
 * POST /api/voting/[episodeId]/ridiculous/submit
 * Submit a ridiculous challenge option (max 120 chars, locks after 5 submissions)
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const { episodeId } = await params;
        const session = await auth();

        // Auth check
        if (!session?.user?.id || !session.user.email) {
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

        // Check if ridiculous is enabled
        if (!episode.ridiculousEnabled) {
            return NextResponse.json({ error: 'Ridiculous submissions not enabled' }, { status: 400 });
        }

        // Check if submissions are locked
        if (episode.ridiculousSubmissionsLocked) {
            return NextResponse.json({ error: 'Submissions are closed' }, { status: 400 });
        }

        // Check phase
        if (episode.status !== 'challenges_voting') {
            return NextResponse.json({ error: 'Challenges voting is not active' }, { status: 400 });
        }

        // Get request body
        const body = await request.json();
        const { text } = body;

        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return NextResponse.json({ error: 'text is required' }, { status: 400 });
        }

        if (text.length > 120) {
            return NextResponse.json({ error: 'text must be 120 characters or less' }, { status: 400 });
        }

        // Get user display name
        const user = await getUserByEmail(session.user.email);
        const displayName = user?.displayName || 'Anonymous';

        // Add the option
        const option = await addRidiculousOption(
            episodeId,
            text.trim(),
            new ObjectId(session.user.id),
            displayName
        );

        if (!option) {
            return NextResponse.json({ error: 'Submissions are closed' }, { status: 400 });
        }

        // Get updated episode
        const updatedEpisode = await getEpisodeById(episodeId);

        return NextResponse.json({
            success: true,
            option: {
                id: option.id,
                text: option.text,
                submittedByDisplayName: option.submittedByDisplayName,
            },
            submissionsLocked: updatedEpisode?.ridiculousSubmissionsLocked || false,
            currentCount: updatedEpisode?.options.ridiculous.length || 0,
        });
    } catch (error) {
        console.error('[api/voting/[episodeId]/ridiculous/submit] Error:', error);
        return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
    }
}
