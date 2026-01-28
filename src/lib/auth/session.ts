import { auth } from '@/auth';
import { redirect } from 'next/navigation';

/**
 * Get the current server-side session
 */
export async function getServerSession() {
    return await auth();
}

/**
 * Require authentication - redirects to login if not authenticated
 */
export async function requireAuth() {
    const session = await auth();

    if (!session || !session.user) {
        redirect('/login');
    }

    return session;
}

/**
 * Require onboarding completion - redirects to onboarding if not complete
 */
export async function requireOnboarding() {
    const session = await requireAuth();

    if (!session.user.onboardingComplete) {
        redirect('/onboarding');
    }

    return session;
}

/**
 * Require specific role - redirects to unauthorized if insufficient permissions
 */
export async function requireRole(allowedRoles: Array<'user' | 'admin' | 'superAdmin'>) {
    const session = await requireOnboarding();

    if (!allowedRoles.includes(session.user.role)) {
        redirect('/unauthorized');
    }

    return session;
}

/**
 * Check if user is admin or superAdmin
 */
export async function isAdmin() {
    const session = await auth();
    return session?.user.role === 'admin' || session?.user.role === 'superAdmin';
}

/**
 * Check if user is superAdmin
 */
export async function isSuperAdmin() {
    const session = await auth();
    return session?.user.role === 'superAdmin';
}
