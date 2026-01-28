import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const publicExact = ['/', '/login', '/signup', '/verify', '/legal/privacy', '/legal/terms'];
const publicPrefixes: string[] = []; // add later only if needed

const preOnboardingExact = ['/onboarding', '/account'];
const authRoutes = ['/login', '/signup'];

function isPublicPath(pathname: string) {
    if (publicExact.includes(pathname)) return true;
    return publicPrefixes.some((prefix) => pathname.startsWith(prefix + '/'));
}

function isPreOnboardingAllowed(pathname: string) {
    if (preOnboardingExact.includes(pathname)) return true;
    return false;
}

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1) Always bypass Next internals and all API routes
    if (
        pathname.startsWith('/_next/') ||
        pathname === '/favicon.ico' ||
        pathname.startsWith('/api/')
    ) {
        return NextResponse.next();
    }

    // 2) Read auth token
    const token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET,
    });

    const isAuthenticated = !!token;
    const onboardingComplete = (token as any)?.onboardingComplete ?? false;

    // 3) If logged in, block auth pages
    if (isAuthenticated && authRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 4) Public pages pass through
    if (isPublicPath(pathname)) {
        return NextResponse.next();
    }

    // 5) Non-public requires auth
    if (!isAuthenticated) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 6) Onboarding gate
    if (!onboardingComplete) {
        if (isPreOnboardingAllowed(pathname)) return NextResponse.next();
        return NextResponse.redirect(new URL('/onboarding', request.url));
    }

    // 7) All good
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};