'use client';

import { useSession } from 'next-auth/react';
import { SignOutButton } from './SignOutButton';
import Link from 'next/link';

interface AuthButtonProps {
    variant?: 'main' | 'ros';
}

export function AuthButton({ variant = 'main' }: AuthButtonProps) {
    const { data: session, status } = useSession();

    // Loading state
    if (status === 'loading') {
        return (
            <div className="w-20 h-8 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        );
    }

    // Logged in - show account link and sign out
    if (session?.user) {
        const isOnboardingComplete = session.user.onboardingComplete;

        return (
            <div className="flex items-center gap-3">
                <Link
                    href="/account"
                    className={`text-sm transition-colors ${variant === 'ros'
                            ? 'text-foreground/80 hover:text-foreground font-mono'
                            : 'text-foreground/70 hover:text-foreground'
                        }`}
                >
                    {isOnboardingComplete ? session.user.displayName : 'Account'}
                </Link>
                <SignOutButton
                    variant="link"
                    className={`text-sm transition-colors ${variant === 'ros'
                            ? 'text-foreground/60 hover:text-foreground font-mono'
                            : 'text-foreground/60 hover:text-foreground'
                        }`}
                >
                    Sign Out
                </SignOutButton>
            </div>
        );
    }

    // Logged out - show sign in link
    return (
        <Link
            href="/login"
            className={`text-sm transition-colors ${variant === 'ros'
                    ? 'text-foreground/80 hover:text-foreground font-mono'
                    : 'text-foreground/70 hover:text-foreground'
                }`}
        >
            Sign In
        </Link>
    );
}
