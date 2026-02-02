import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createEpisode, listEpisodes, isSlugAvailable } from '@/lib/db/episode';

function isAdmin(role: string | undefined): boolean {
    return role === 'admin' || role === 'superAdmin';
}

/**
 * POST /api/admin/episodes - Create a new episode with paper options
 */
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        if (!isAdmin(session.user.role)) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const body = await request.json();
        const { episodeNumber, operationTitle, slug, pollUrl, hook, papers } = body;

        // Validate required fields
        if (!episodeNumber || typeof episodeNumber !== 'number') {
            return NextResponse.json({ error: 'episodeNumber is required' }, { status: 400 });
        }

        if (!operationTitle || typeof operationTitle !== 'string') {
            return NextResponse.json({ error: 'operationTitle is required' }, { status: 400 });
        }

        if (!slug || typeof slug !== 'string') {
            return NextResponse.json({ error: 'slug is required' }, { status: 400 });
        }

        if (!hook || typeof hook !== 'string') {
            return NextResponse.json({ error: 'hook is required' }, { status: 400 });
        }

        if (!papers || !Array.isArray(papers) || papers.length < 2) {
            return NextResponse.json({ error: 'At least 2 paper options required' }, { status: 400 });
        }

        // Validate papers
        for (const paper of papers) {
            if (!paper.name || !paper.weight || !paper.textureRef || !paper.inspirationRef) {
                return NextResponse.json(
                    { error: 'Each paper requires name, weight, textureRef, inspirationRef' },
                    { status: 400 }
                );
            }
        }

        // Check slug availability
        const available = await isSlugAvailable(slug);
        if (!available) {
            return NextResponse.json({ error: 'Slug is already in use' }, { status: 400 });
        }

        const episode = await createEpisode(
            { episodeNumber, operationTitle, slug, pollUrl, hook, papers },
            session.user.id,
            session.user.role
        );

        return NextResponse.json({
            success: true,
            episode: {
                _id: episode._id.toString(),
                episodeNumber: episode.episodeNumber,
                operationTitle: episode.operationTitle,
                slug: episode.slug,
                status: episode.status,
            },
        });
    } catch (error) {
        console.error('[api/admin/episodes] POST Error:', error);
        return NextResponse.json({ error: 'Failed to create episode' }, { status: 500 });
    }
}

/**
 * GET /api/admin/episodes - List all episodes
 */
export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        if (!isAdmin(session.user.role)) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') as any;

        const episodes = await listEpisodes(status || undefined);

        return NextResponse.json({
            episodes: episodes.map((ep) => ({
                _id: ep._id.toString(),
                episodeNumber: ep.episodeNumber,
                operationTitle: ep.operationTitle,
                slug: ep.slug,
                status: ep.status,
                paperName: ep.paperName,
                createdAt: ep.createdAt,
                updatedAt: ep.updatedAt,
            })),
        });
    } catch (error) {
        console.error('[api/admin/episodes] GET Error:', error);
        return NextResponse.json({ error: 'Failed to list episodes' }, { status: 500 });
    }
}
