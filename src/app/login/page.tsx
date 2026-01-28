import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth/session';
import { LoginForm } from '@/components/auth/LoginForm';

export default async function LoginPage() {
    // Check if user is already logged in
    const session = await getServerSession();

    if (session) {
        redirect('/');
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <LoginForm />
        </div>
    );
}
