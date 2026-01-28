import { requireAuth } from '@/lib/auth/session';
import { SignOutButton } from '@/components/auth/SignOutButton';

export default async function AccountPage() {
    const session = await requireAuth();

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Account</h1>
                    <p className="text-foreground/60">Your account information</p>
                </div>

                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-6 space-y-6">
                    {/* Profile Information */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Profile</h2>
                        <dl className="space-y-3">
                            <div className="flex justify-between py-2 border-b border-neutral-300 dark:border-neutral-700">
                                <dt className="text-foreground/60">Email</dt>
                                <dd className="font-medium">{session.user.email}</dd>
                            </div>

                            <div className="flex justify-between py-2 border-b border-neutral-300 dark:border-neutral-700">
                                <dt className="text-foreground/60">Display Name</dt>
                                <dd className="font-medium">{session.user.displayName || 'Not set'}</dd>
                            </div>

                            <div className="flex justify-between py-2 border-b border-neutral-300 dark:border-neutral-700">
                                <dt className="text-foreground/60">Role</dt>
                                <dd className="font-medium capitalize">{session.user.role}</dd>
                            </div>

                            <div className="flex justify-between py-2">
                                <dt className="text-foreground/60">Onboarding Status</dt>
                                <dd className="font-medium">
                                    {session.user.onboardingComplete ? (
                                        <span className="text-green-600 dark:text-green-400">✓ Complete</span>
                                    ) : (
                                        <span className="text-yellow-600 dark:text-yellow-400">Incomplete</span>
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-neutral-300 dark:border-neutral-700">
                        <SignOutButton
                            className="px-6 py-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded transition-colors"
                        />
                    </div>
                </div>

                {!session.user.onboardingComplete && (
                    <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-lg">
                        <p className="text-sm">
                            <strong>Action Required:</strong> Please complete your{' '}
                            <a href="/onboarding" className="underline hover:no-underline">
                                onboarding
                            </a>{' '}
                            to access all features.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
