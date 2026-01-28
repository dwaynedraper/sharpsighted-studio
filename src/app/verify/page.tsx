import Link from 'next/link';

export default function VerifyPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md text-center">
                <div className="mb-8">
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
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Check Your Email</h1>
                    <p className="text-foreground/60 mb-6">
                        A sign-in link has been sent to your email address.
                    </p>
                    <p className="text-sm text-foreground/60">
                        Click the link in the email to complete the sign-in process. The link will expire in 24 hours.
                    </p>
                </div>

                <div className="space-y-3">
                    <Link
                        href="/login"
                        className="block px-6 py-3 bg-[var(--accent)] text-white font-medium rounded hover:opacity-90 transition-opacity"
                    >
                        Back to Sign In
                    </Link>

                    <Link
                        href="/"
                        className="block text-sm text-foreground/60 hover:text-foreground transition-colors"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
