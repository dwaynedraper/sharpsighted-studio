// src/app/api/onboarding/check-display-name/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { checkDisplayNameAvailable } from '@/lib/db/user'

type ValidateResult =
    | { ok: false; message: string }
    | { ok: true; value: string }

function validateDisplayName(displayName: unknown): ValidateResult {
    if (typeof displayName !== 'string') return { ok: false, message: 'Display name is required' }

    const v = displayName.trim()

    if (v.length < 3) return { ok: false, message: 'Display name must be at least 3 characters' }
    if (v.length > 20) return { ok: false, message: 'Display name must be 20 characters or less' }

    if (!/^[A-Za-z0-9_]+(?: [A-Za-z0-9_]+)*$/.test(v)) {
        return {
            ok: false,
            message: 'Display name can only contain letters, numbers, and underscores',
        }
    }

    return { ok: true, value: v }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json(
                { available: false, message: 'Not authenticated' },
                { status: 401 }
            )
        }

        const body: unknown = await request.json()
        const displayName = (body as { displayName?: unknown })?.displayName

        const res = validateDisplayName(displayName)
        if (!res.ok) {
            return NextResponse.json(
                { available: false, message: res.message },
                { status: 400 }
            )
        }

        const available = await checkDisplayNameAvailable(res.value, session.user.id)

        return NextResponse.json({
            available,
            message: available ? 'Display name is available' : 'Display name is already taken',
        })
    } catch (e) {
        console.error('Error checking display name:', e)
        return NextResponse.json(
            { available: false, message: 'Server error' },
            { status: 500 }
        )
    }
}