import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { updateOnboardingComplete } from '@/lib/db/user'

type ValidationResult =
    | { ok: false; message: string }
    | { ok: true; value: string }

function validateFirstName(firstName: unknown): ValidationResult {
    if (typeof firstName !== 'string') {
        return { ok: false, message: 'First name is required' }
    }

    const v = firstName.trim()

    if (v.length < 1) {
        return { ok: false, message: 'First name is required' }
    }

    if (v.length > 50) {
        return { ok: false, message: 'First name must be 50 characters or less' }
    }

    return { ok: true, value: v }
}

function validateDisplayName(displayName: unknown): ValidationResult {
    if (typeof displayName !== 'string') {
        return { ok: false, message: 'Display name is required' }
    }

    const v = displayName.trim()

    if (v.length < 3) {
        return { ok: false, message: 'Display name must be at least 3 characters' }
    }

    if (v.length > 20) {
        return { ok: false, message: 'Display name must be 20 characters or less' }
    }

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
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        if (session.user.onboardingComplete) {
            return NextResponse.json({ error: 'Onboarding already completed' }, { status: 400 })
        }

        const body = await request.json()
        const firstNameRes = validateFirstName(body?.firstName)
        if (!firstNameRes.ok) return NextResponse.json({ error: firstNameRes.message }, { status: 400 })

        const displayNameRes = validateDisplayName(body?.displayName)
        if (!displayNameRes.ok) return NextResponse.json({ error: displayNameRes.message }, { status: 400 })

        try {
            await updateOnboardingComplete(session.user.id, firstNameRes.value, displayNameRes.value)
            return NextResponse.json({ success: true })
        } catch (e: any) {
            if (e?.message === 'Display name is already taken') {
                return NextResponse.json({ error: 'Display name is already taken' }, { status: 409 })
            }
            throw e
        }
    } catch (e) {
        console.error('Error completing onboarding:', e)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}