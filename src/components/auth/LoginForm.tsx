'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function getOAuthErrorMessage(code: string | null) {
    if (!code) return '';

    switch (code) {
        case 'OAuthAccountNotLinked':
            return 'This email is already linked to another sign-in method. Please use the provider you originally signed up with.';
        case 'AccessDenied':
            return 'Sign-in was cancelled or denied.';
        default:
            return 'Unable to sign in. Please try again.';
    }
}

export function LoginForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    const oauthError = getOAuthErrorMessage(searchParams.get('error'));

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [error, setError] = useState('');

    // ✅ hydrate error from OAuth redirect
    useEffect(() => {
        if (oauthError) setError(oauthError);
    }, [oauthError]);

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const result = await signIn('nodemailer', {
                email,
                callbackUrl,
                redirect: false,
            });

            if (result?.error) {
                setError('Failed to send magic link. Please try again.');
            } else {
                setEmailSent(true);
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        await signIn('google', { callbackUrl });
    };

    const handleDiscordSignIn = async () => {
        setIsLoading(true);
        await signIn('discord', { callbackUrl });
    };

    if (emailSent) {
        return (
            <div className="text-center">
                <h2 className="text-xl font-bold mb-2">Check your email</h2>
                <p className="text-foreground/60 mb-4">
                    We sent a magic link to <strong>{email}</strong>
                </p>
                <button
                    onClick={() => setEmailSent(false)}
                    className="text-sm text-[var(--accent)] hover:underline"
                >
                    Use a different email
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                <p className="text-foreground/60">Sign in to your account</p>
            </div>

            {/* 🔴 unified error display */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleEmailSignIn} className="space-y-4 mb-6">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded border"
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-6 py-3 bg-[var(--accent)] text-white rounded"
                >
                    {isLoading ? 'Sending…' : 'Send Magic Link'}
                </button>
            </form>

            <div className="space-y-3">
                <button onClick={handleGoogleSignIn} className="oauth google">
                    Continue with Google
                </button>

                <button onClick={handleDiscordSignIn} className="oauth discord">
                    Continue with Discord
                </button>
            </div>

            <p className="text-center text-sm text-foreground/60 mt-6">
                Don’t have an account?{' '}
                <Link href="/signup" className="text-[var(--accent)] hover:underline">
                    Sign up
                </Link>
            </p>
        </div>
    );
}