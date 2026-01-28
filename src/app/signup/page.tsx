import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth/session';
import { SignupForm } from '@/components/auth/SignupForm';

export default async function SignupPage() {
    // Check if user is already logged in
    const session = await getServerSession();

    if (session) {
        redirect('/');
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <SignupForm />
        </div>
    );
}
