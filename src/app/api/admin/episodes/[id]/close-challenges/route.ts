import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getEpisodeById, closeChallengesVote } from '@/lib/db/episode';

interface RouteParams {
    params: Promise<{ id: string }>;
}

function isSuperAdmin(role: string | undefined): boolean {
    return role === 'superAdmin';
}

/**
 * POST /api/admin/episodes/[id]/close-challenges
 * Close challenges voting and determine winners
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        if (!isSuperAdmin(session.user.role)) {
            return NextResponse.json({ error: 'SuperAdmin access required' }, { status: 403 });
        }

        const existing = await getEpisodeById(id);
        if (!existing) {
            return NextResponse.json({ error: 'Episode not found' }, { status: 404 });
        }

        if (existing.status !== 'challenges_voting') {
            return NextResponse.json({ error: 'Episode is not in challenges voting phase' }, { status: 400 });
        }

        const episode = await closeChallengesVote(id, session.user.id, session.user.role);

        return NextResponse.json({
            success: true,
            episode: {
                _id: episode?._id.toString(),
                status: episode?.status,
                results: episode?.results,
            },
        });
    } catch (error) {
        console.error('[api/admin/episodes/[id]/close-challenges] Error:', error);
        return NextResponse.json({ error: 'Failed to close challenges vote' }, { status: 500 });
    }
}
