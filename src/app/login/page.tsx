import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { LoginForm } from '@/components/auth/LoginForm'

export default async function LoginPage() {
    const session = await auth()
    if (session?.user?.id) redirect('/')

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <LoginForm />
        </div>
    )
}