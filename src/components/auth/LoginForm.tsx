'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export function LoginForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [error, setError] = useState('');

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
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        await signIn('google', { callbackUrl });
    };

    if (emailSent) {
        return (
            <div className="text-center">
                <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                        <svg
                            className="w-8 h-8 text-green-600 dark:text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold mb-2">Check Your Email</h2>
                    <p className="text-foreground/60 mb-4">
                        We sent a magic link to <strong>{email}</strong>
                    </p>
                    <p className="text-sm text-foreground/60">
                        Click the link in the email to sign in. The link will expire in 24 hours.
                    </p>
                </div>

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

            {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleEmailSignIn} className="space-y-4 mb-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                        placeholder="you@example.com"
                        disabled={isLoading}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-6 py-3 bg-[var(--accent)] text-white font-medium rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Sending...' : 'Send Magic Link'}
                </button>
            </form>

            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-300 dark:border-neutral-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-background text-foreground/60">Or continue with</span>
                </div>
            </div>

            <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 font-medium rounded hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                </svg>
                Continue with Google
            </button>

            <p className="text-center text-sm text-foreground/60 mt-6">
                Don't have an account?{' '}
                <Link href="/signup" className="text-[var(--accent)] hover:underline font-medium">
                    Sign up
                </Link>
            </p>
        </div>
    );
}
