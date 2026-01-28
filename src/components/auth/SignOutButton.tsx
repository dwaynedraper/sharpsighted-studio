'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface SignOutButtonProps {
    children?: React.ReactNode;
    className?: string;
    variant?: 'button' | 'link';
}

export function SignOutButton({
    children = 'Sign Out',
    className = '',
    variant = 'button'
}: SignOutButtonProps) {
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut({
            callbackUrl: '/login',
            redirect: true,
        });
    };

    if (variant === 'link') {
        return (
            <button
                onClick={handleSignOut}
                className={className || 'text-sm text-foreground/60 hover:text-foreground transition-colors'}
            >
                {children}
            </button>
        );
    }

    return (
        <button
            onClick={handleSignOut}
            className={className || 'px-4 py-2 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors rounded'}
        >
            {children}
        </button>
    );
}
