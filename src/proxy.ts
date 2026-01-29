import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const publicExact = ['/', '/login', '/signup', '/verify', '/legal/privacy', '/legal/terms']
const publicPrefixes: string[] = []
const authRoutes = ['/login', '/signup']

// Allowed routes before onboarding completion
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

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // 1) Bypass Next internals + API routes
    if (
        pathname.startsWith('/_next/') ||
        pathname === '/favicon.ico' ||
        pathname.startsWith('/api/')
    ) {
        return NextResponse.next()
    }

    // 2) Read token (Edge-safe). Requires session.strategy = 'jwt'
    const token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET,
        cookieName: process.env.NODE_ENV === 'development'
            ? 'next-auth.session-token'
            : '__Secure-next-auth.session-token',
    })

    const isAuthenticated = !!token
    const role = (token as any)?.role
    const onboardingComplete = (token as any)?.onboardingComplete ?? false

    // 3) If logged in, block auth pages (send to correct landing)
    if (isAuthenticated && authRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL(defaultAuthedLanding(role), request.url))
    }

    // 4) Public pages pass through
    if (isPublicPath(pathname)) {
        return NextResponse.next()
    }

    // 5) Non-public requires auth
    if (!isAuthenticated) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // 6) Onboarding gate (applies to admin too per spec)
    if (!onboardingComplete) {
        if (isPreOnboardingAllowed(pathname)) return NextResponse.next()
        return NextResponse.redirect(new URL('/onboarding', request.url))
    }

    // 7) Admin area gate
    if (isAdminPath(pathname) && !isAdminRole(role)) {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}