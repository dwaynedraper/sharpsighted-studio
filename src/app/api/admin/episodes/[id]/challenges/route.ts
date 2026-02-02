import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getEpisodeById, addBenchmarkOption, addTrapOption, updateEpisode } from '@/lib/db/episode';

interface RouteParams {
    params: Promise<{ id: string }>;
}

function isAdmin(role: string | undefined): boolean {
    return role === 'admin' || role === 'superAdmin';
}

/**
 * POST /api/admin/episodes/[id]/challenges
 * Add challenge options (benchmarks, traps) to an episode
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        if (!isAdmin(session.user.role)) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const existing = await getEpisodeById(id);
        if (!existing) {
            return NextResponse.json({ error: 'Episode not found' }, { status: 404 });
        }

        const body = await request.json();
        const { type, optionData, identity, nightmare, handicap, ridiculousEnabled } = body;

        // Update episode metadata if provided
        if (identity !== undefined || nightmare !== undefined || handicap !== undefined || ridiculousEnabled !== undefined) {
            await updateEpisode(
                id,
                {
                    identity: identity ?? existing.identity,
                    nightmare: nightmare ?? existing.nightmare,
                    handicap: handicap ?? existing.handicap,
                    ridiculousEnabled: ridiculousEnabled ?? existing.ridiculousEnabled,
                },
                session.user.id,
                session.user.role
            );
        }

        // Add option if provided
        if (type && optionData) {
            if (type === 'benchmark') {
                if (!optionData.name || !optionData.description) {
                    return NextResponse.json({ error: 'name and description required' }, { status: 400 });
                }
                const option = await addBenchmarkOption(id, optionData, session.user.id, session.user.role);
                return NextResponse.json({ success: true, option });
            }

            if (type === 'trap') {
                if (!optionData.name || !optionData.description || !optionData.trap) {
                    return NextResponse.json({ error: 'name, description, and trap required' }, { status: 400 });
                }
                const option = await addTrapOption(id, optionData, session.user.id, session.user.role);
                return NextResponse.json({ success: true, option });
            }

            return NextResponse.json({ error: 'Invalid type. Use "benchmark" or "trap"' }, { status: 400 });
        }

        // Get updated episode
        const updated = await getEpisodeById(id);

        return NextResponse.json({
            success: true,
            episode: {
                ...updated,
                _id: updated?._id.toString(),
            },
        });
    } catch (error) {
        console.error('[api/admin/episodes/[id]/challenges] Error:', error);
        return NextResponse.json({ error: 'Failed to update challenges' }, { status: 500 });
    }
}
