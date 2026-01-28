import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/auth'

const publicExact = ['/', '/login', '/signup', '/verify', '/legal/privacy', '/legal/terms']
const publicPrefixes: string[] = []

const authRoutes = ['/login', '/signup']

const preOnboardingExact = ['/onboarding', '/account']

const adminPrefixes = ['/dashboard']

function isPublicPath(pathname: string) {
    if (publicExact.includes(pathname)) return true
    return publicPrefixes.some((prefix) => pathname.startsWith(prefix + '/'))
}

function isPreOnboardingAllowed(pathname: string) {
    return preOnboardingExact.includes(pathname)
}

function isAdminRole(role: unknown) {
    return role === 'admin' || role === 'superAdmin'
}

function defaultAuthedLanding(role: unknown) {
    return isAdminRole(role) ? '/dashboard' : '/'
}

function isAdminPath(pathname: string) {
    return adminPrefixes.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // 1) Bypass Next internals + API routes
    if (
        pathname.startsWith('/_next/') ||
        pathname === '/favicon.ico' ||
        pathname.startsWith('/api/')
    ) {
        return NextResponse.next()
    }

    // 2) Session (server-side)
    const session = await auth()
    const isAuthenticated = !!session?.user
    const role = session?.user?.role
    const onboardingComplete = session?.user?.onboardingComplete ?? false

    // 3) If logged in, block auth pages (send to correct landing)
    if (isAuthenticated && authRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL(defaultAuthedLanding(role), request.url))
    }

    // 4) Public pages pass through
    if (isPublicPath(pathname)) {
        // If an admin hits "/", push them to dashboard for your mental model
        if (isAuthenticated && pathname === '/' && isAdminRole(role)) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
        return NextResponse.next()
    }

    // 5) Non-public requires auth
    if (!isAuthenticated) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // 6) Admin area gate
    if (isAdminPath(pathname)) {
        // If role exists and is not admin, block.
        // If role is missing, do NOT assume admin, block to be safe.
        if (!isAdminRole(role)) {
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
        // Allow admins into dashboard even if onboarding is incomplete.
        return NextResponse.next()
    }

    // 7) Onboarding gate (non-admin area)
    if (!onboardingComplete) {
        if (isPreOnboardingAllowed(pathname)) return NextResponse.next()
        return NextResponse.redirect(new URL('/onboarding', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}