import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { updateOnboardingComplete } from '@/lib/db/user';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        // Check if onboarding is already complete
        if (session.user.onboardingComplete) {
            return NextResponse.json(
                { error: 'Onboarding already completed' },
                { status: 400 }
            );
        }

        const { firstName, displayName } = await request.json();

        // Validation
        if (!firstName || firstName.trim().length < 1) {
            return NextResponse.json(
                { error: 'First name is required' },
                { status: 400 }
            );
        }

        if (!displayName || displayName.trim().length < 2) {
            return NextResponse.json(
                { error: 'Display name must be at least 2 characters' },
                { status: 400 }
            );
        }

        if (displayName.length > 30) {
            return NextResponse.json(
                { error: 'Display name must be 30 characters or less' },
                { status: 400 }
            );
        }

        try {
            // Update user in database
            await updateOnboardingComplete(
                session.user.id,
                firstName.trim(),
                displayName.trim()
            );

            return NextResponse.json({
                success: true,
                message: 'Onboarding completed successfully',
            });
        } catch (error: any) {
            if (error.message === 'Display name is already taken') {
                return NextResponse.json(
                    { error: 'Display name is already taken' },
                    { status: 409 }
                );
            }
            throw error;
        }
    } catch (error) {
        console.error('Error completing onboarding:', error);
        return NextResponse.json(
            { error: 'Server error' },
            { status: 500 }
        );
    }
}
