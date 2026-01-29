import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { OnboardingForm } from '@/components/auth/OnboardingForm'

export default async function OnboardingPage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/login?callbackUrl=/onboarding')
    }

    if (session.user.onboardingComplete) {
        redirect('/')
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <OnboardingForm />
        </div>
    )
}