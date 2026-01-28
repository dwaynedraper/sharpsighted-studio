import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth/session';
import { OnboardingForm } from '@/components/auth/OnboardingForm';

export default async function OnboardingPage() {
    const session = await getServerSession();

    // Redirect to login if not authenticated
    if (!session) {
        redirect('/login?callbackUrl=/onboarding');
    }

    // Redirect to home if onboarding is already complete
    if (session.user.onboardingComplete) {
        redirect('/');
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <OnboardingForm />
        </div>
    );
}
