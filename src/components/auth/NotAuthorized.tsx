import Link from 'next/link';

interface NotAuthorizedProps {
    message?: string;
    showSignUp?: boolean;
}

export function NotAuthorized({
    message = "You don't have permission to access this page.",
    showSignUp = true
}: NotAuthorizedProps) {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 mb-4">
                        <svg
                            className="w-8 h-8 text-neutral-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Access Restricted</h1>
                    <p className="text-foreground/60">{message}</p>
                </div>

                <div className="flex flex-col gap-3">
                    <Link
                        href="/login"
                        className="px-6 py-3 bg-[var(--accent)] text-white font-medium rounded hover:opacity-90 transition-opacity"
                    >
                        Sign In
                    </Link>

                    {showSignUp && (
                        <Link
                            href="/signup"
                            className="px-6 py-3 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 font-medium rounded transition-colors"
                        >
                            Create Account
                        </Link>
                    )}

                    <Link
                        href="/"
                        className="text-sm text-foreground/60 hover:text-foreground transition-colors mt-2"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
