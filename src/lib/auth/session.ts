import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export async function getServerSession() {
    return auth()
}

export async function requireAuth() {
    const session = await auth()
    if (!session?.user) redirect('/login')
    return session
}

export async function requireOnboarding() {
    const session = await requireAuth()
    if (!session.user.onboardingComplete) redirect('/onboarding')
    return session
}

export async function requireRole(allowedRoles: Array<'user' | 'admin' | 'superAdmin'>) {
    const session = await requireOnboarding()
    if (!allowedRoles.includes(session.user.role)) redirect('/unauthorized')
    return session
}

export async function isAdmin() {
    const session = await auth()
    return session?.user.role === 'admin' || session?.user.role === 'superAdmin'
}

export async function isSuperAdmin() {
    const session = await auth()
    return session?.user.role === 'superAdmin'
}