import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { updateUserRole } from '@/lib/db/user'

type RoleValue = 'user' | 'admin' | 'superAdmin'

function isValidRole(role: unknown): role is RoleValue {
    return role === 'user' || role === 'admin' || role === 'superAdmin'
}

export async function POST(request: NextRequest) {
    try {
        // 1) Require authentication
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        // 2) Require onboarding complete
        if (!session.user.onboardingComplete) {
            return NextResponse.json({ error: 'Onboarding not complete' }, { status: 403 })
        }

        // 3) Require superAdmin
        if (session.user.role !== 'superAdmin') {
            return NextResponse.json({ error: 'Forbidden: superAdmin only' }, { status: 403 })
        }

        // 4) Validate request body
        const body: unknown = await request.json()
        const userId = (body as { userId?: unknown })?.userId
        const role = (body as { role?: unknown })?.role

        if (typeof userId !== 'string' || !userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 })
        }

        if (!isValidRole(role)) {
            return NextResponse.json({ error: 'Invalid role value' }, { status: 400 })
        }

        // 5) Update role
        try {
            await updateUserRole(userId, role, session.user.id, session.user.role)
            return NextResponse.json({ success: true })
        } catch (e: any) {
            if (e?.message === 'User not found') {
                return NextResponse.json({ error: 'User not found' }, { status: 404 })
            }
            if (e?.message === 'User already has this role') {
                return NextResponse.json({ error: 'User already has this role' }, { status: 400 })
            }
            throw e
        }
    } catch (e) {
        console.error('Error setting user role:', e)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
