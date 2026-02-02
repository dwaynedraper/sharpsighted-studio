import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import {
    getEpisodeById,
    updateEpisode,
    archiveEpisode,
    isSlugAvailable,
} from '@/lib/db/episode';

interface RouteParams {
    params: Promise<{ id: string }>;
}

function isAdmin(role: string | undefined): boolean {
    return role === 'admin' || role === 'superAdmin';
}

/**
 * GET /api/admin/episodes/[id] - Get episode by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        if (!isAdmin(session.user.role)) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const episode = await getEpisodeById(id);
        if (!episode) {
            return NextResponse.json({ error: 'Episode not found' }, { status: 404 });
        }

        return NextResponse.json({
            episode: {
                ...episode,
                _id: episode._id.toString(),
            },
        });
    } catch (error) {
        console.error('[api/admin/episodes/[id]] GET Error:', error);
        return NextResponse.json({ error: 'Failed to get episode' }, { status: 500 });
    }
}

/**
 * PATCH /api/admin/episodes/[id] - Update episode
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        if (!isAdmin(session.user.role)) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const body = await request.json();

        // Validate slug if provided
        if (body.slug) {
            const available = await isSlugAvailable(body.slug, id);
            if (!available) {
                return NextResponse.json({ error: 'Slug is already in use' }, { status: 400 });
            }
        }

        const episode = await updateEpisode(id, body, session.user.id, session.user.role);

        if (!episode) {
            return NextResponse.json({ error: 'Episode not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            episode: {
                ...episode,
                _id: episode._id.toString(),
            },
        });
    } catch (error) {
        console.error('[api/admin/episodes/[id]] PATCH Error:', error);
        return NextResponse.json({ error: 'Failed to update episode' }, { status: 500 });
    }
}

/**
 * DELETE /api/admin/episodes/[id] - Archive episode
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        if (!isAdmin(session.user.role)) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const episode = await archiveEpisode(id, session.user.id, session.user.role);

        if (!episode) {
            return NextResponse.json({ error: 'Episode not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Episode archived' });
    } catch (error) {
        console.error('[api/admin/episodes/[id]] DELETE Error:', error);
        return NextResponse.json({ error: 'Failed to archive episode' }, { status: 500 });
    }
}
