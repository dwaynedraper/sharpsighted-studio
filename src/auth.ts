import NextAuth, { type NextAuthConfig } from 'next-auth';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import clientPromise from '@/lib/db/mongodb';
import { getUserById } from '@/lib/db/user';
import { createAuditLog } from '@/lib/db/audit';

// Determine environment-specific settings
const isDev = process.env.NODE_ENV === 'development';
const cookieDomain = isDev ? '.sharpsighted.local' : '.sharpsighted.studio';

export const authConfig: NextAuthConfig = {
    adapter: MongoDBAdapter(clientPromise) as any,

    providers: [
        // Email magic link provider
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: process.env.EMAIL_SERVER_PORT ? Number(process.env.EMAIL_SERVER_PORT) : undefined,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM || 'no-reply@sharpsighted.local',

            // In development, log the magic link to console
            ...(isDev && {
                sendVerificationRequest: async ({ identifier: email, url }) => {
                    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log('📧 MAGIC LINK EMAIL');
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log(`To: ${email}`);
                    console.log(`\n🔗 Click here to sign in:\n${url}\n`);
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
                },
            }),
        }),

        // Google OAuth provider
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code',
                },
            },
        }),
    ],

    // Database-backed sessions
    session: {
        strategy: 'database',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60, // 24 hours
    },

    // Cookie configuration for cross-subdomain support
    cookies: {
        sessionToken: {
            name: isDev ? `next-auth.session-token` : `__Secure-next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                domain: cookieDomain,
                secure: !isDev,
            },
        },
        callbackUrl: {
            name: isDev ? `next-auth.callback-url` : `__Secure-next-auth.callback-url`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                domain: cookieDomain,
                secure: !isDev,
            },
        },
        csrfToken: {
            name: isDev ? `next-auth.csrf-token` : `__Host-next-auth.csrf-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                // IMPORTANT:
                // - Do NOT set domain for csrf in production if using __Host-
                // - Keep secure true in production
                ...(isDev
                    ? { secure: false, domain: cookieDomain }
                    : { secure: true }),
            },
        },
    },

    pages: {
        signIn: '/login',
        verifyRequest: '/verify',
        error: '/login', // Redirect auth errors to login
    },

    callbacks: {
        async signIn({ user, account, profile }) {
            // Log sign-in event
            if (user.id && account) {
                await createAuditLog({
                    actorUserId: user.id,
                    actorRole: 'user',
                    action: account.provider === 'google' ? 'LOGIN_GOOGLE' : 'LOGIN_EMAIL',
                    entityType: 'user',
                    entityId: user.id,
                    metadata: {
                        provider: account.provider,
                    },
                });
            }

            return true;
        },

        async session({ session, user }) {
            // Fetch fresh user data to include custom fields
            if (user.id) {
                const userData = await getUserById(user.id);

                if (userData) {
                    session.user.id = user.id;
                    session.user.role = userData.role;
                    session.user.displayName = userData.displayName;
                    session.user.onboardingComplete = userData.onboarding.isComplete;
                }
            }

            return session;
        },
    },

    events: {
        async createUser({ user }) {
            console.log('✅ New user created:', user.email);
        },

        async linkAccount({ user, account }) {
            console.log(`✅ Account linked: ${account.provider} → ${user.email}`);
        },
    },

    debug: isDev,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
