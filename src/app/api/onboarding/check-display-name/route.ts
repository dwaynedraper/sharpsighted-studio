import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { checkDisplayNameAvailable } from '@/lib/db/user';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session || !session.user) {
            return NextResponse.json(
                { available: false, message: 'Not authenticated' },
                { status: 401 }
            );
        }

        const { displayName } = await request.json();

        if (!displayName || displayName.trim().length < 2) {
            return NextResponse.json(
                { available: false, message: 'Display name must be at least 2 characters' },
                { status: 400 }
            );
        }

        const isAvailable = await checkDisplayNameAvailable(displayName, session.user.id);

        return NextResponse.json({
            available: isAvailable,
            message: isAvailable ? 'Display name is available' : 'Display name is already taken',
        });
    } catch (error) {
        console.error('Error checking display name:', error);
        return NextResponse.json(
            { available: false, message: 'Server error' },
            { status: 500 }
        );
    }
}
