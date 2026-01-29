import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { SignupForm } from '@/components/auth/SignupForm'

export default async function SignupPage() {
    const session = await auth()
    if (session?.user) redirect('/')

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <SignupForm />
        </div>
    )
}