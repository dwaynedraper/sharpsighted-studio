import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            email: string;
            role: 'user' | 'admin' | 'superAdmin';
            displayName: string | null;
            onboardingComplete: boolean;
        } & DefaultSession['user'];
    }

    interface User {
        id: string;
        email: string;
        role: 'user' | 'admin' | 'superAdmin';
        displayName: string | null;
        onboardingComplete: boolean;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        role: 'user' | 'admin' | 'superAdmin';
        displayName: string | null;
        onboardingComplete: boolean;
    }
}
