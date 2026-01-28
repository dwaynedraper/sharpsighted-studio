'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export function OnboardingForm() {
    const router = useRouter();
    const { data: session, update } = useSession();

    const [firstName, setFirstName] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [displayNameError, setDisplayNameError] = useState('');
    const [error, setError] = useState('');

    // Debounced display name check
    useEffect(() => {
        if (displayName.length < 2) {
            setDisplayNameError('');
            return;
        }

        const checkTimeout = setTimeout(async () => {
            setIsChecking(true);
            try {
                const response = await fetch('/api/onboarding/check-display-name', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ displayName }),
                });

                const data = await response.json();

                if (!data.available) {
                    setDisplayNameError(data.message || 'Display name is already taken');
                } else {
                    setDisplayNameError('');
                }
            } catch (err) {
                console.error('Error checking display name:', err);
            } finally {
                setIsChecking(false);
            }
        }, 500);

        return () => clearTimeout(checkTimeout);
    }, [displayName]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/onboarding/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, displayName }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to complete onboarding');
                return;
            }

            // Update the session
            await update();

            // Redirect to home
            router.push('/');
            router.refresh();
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Welcome!</h1>
                <p className="text-foreground/60">
                    Let's set up your profile to get started
                </p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                        First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        maxLength={50}
                        className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                        placeholder="Enter your first name"
                        disabled={isSubmitting}
                    />
                </div>

                <div>
                    <label htmlFor="displayName" className="block text-sm font-medium mb-2">
                        Display Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="displayName"
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                        minLength={2}
                        maxLength={30}
                        className={`w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${displayNameError
                                ? 'border-red-500 dark:border-red-500'
                                : 'border-neutral-300 dark:border-neutral-700'
                            }`}
                        placeholder="Choose a unique display name"
                        disabled={isSubmitting}
                    />
                    <p className="text-xs text-foreground/60 mt-1">
                        This is how others will see you. You can change it once every 90 days.
                    </p>
                    {isChecking && (
                        <p className="text-xs text-foreground/60 mt-1">Checking availability...</p>
                    )}
                    {displayNameError && !isChecking && (
                        <p className="text-xs text-red-500 mt-1">{displayNameError}</p>
                    )}
                    {!displayNameError && !isChecking && displayName.length >= 2 && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                            ✓ Display name is available
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || !!displayNameError || isChecking || !firstName || displayName.length < 2}
                    className="w-full px-6 py-3 bg-[var(--accent)] text-white font-medium rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Completing...' : 'Complete Setup'}
                </button>
            </form>

            <p className="text-xs text-center text-foreground/60 mt-6">
                By completing setup, you agree to our{' '}
                <a href="/legal/terms" className="text-[var(--accent)] hover:underline">
                    Terms of Service
                </a>{' '}
                and{' '}
                <a href="/legal/privacy" className="text-[var(--accent)] hover:underline">
                    Privacy Policy
                </a>
            </p>
        </div>
    );
}
