import NextAuth, { type NextAuthConfig } from 'next-auth'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import GoogleProvider from 'next-auth/providers/google'
import NodemailerProvider from 'next-auth/providers/nodemailer'
import clientPromise from '@/lib/db/mongodb'
import { getUserById } from '@/lib/db/user'
import { createAuditLog } from '@/lib/db/audit'

const isDev = process.env.NODE_ENV === 'development'
const cookieDomain = isDev ? '.sharpsighted.local' : '.sharpsighted.studio'

const hasGoogle =
    !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET

export const authConfig: NextAuthConfig = {
    adapter: MongoDBAdapter(clientPromise) as any,

    providers: [
        NodemailerProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: process.env.EMAIL_SERVER_PORT ? Number(process.env.EMAIL_SERVER_PORT) : undefined,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM || 'no-reply@sharpsighted.local',

            ...(isDev && {
                sendVerificationRequest: async ({ identifier: email, url }) => {
                    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
                    console.log('📧 MAGIC LINK EMAIL')
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
                    console.log(`To: ${email}`)
                    console.log(`\n🔗 Click here to sign in:\n${url}\n`)
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
                },
            }),
        }),

        ...(hasGoogle
            ? [
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
            ]
            : []),
    ] as NextAuthConfig['providers'],

    // ✅ MUST be JWT if you want Edge middleware to work with getToken()
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60,
    },

    cookies: {
        sessionToken: {
            name: isDev ? 'next-auth.session-token' : '__Secure-next-auth.session-token',
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                domain: cookieDomain,
                secure: !isDev,
            },
        },
        callbackUrl: {
            name: isDev ? 'next-auth.callback-url' : '__Secure-next-auth.callback-url',
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                domain: cookieDomain,
                secure: !isDev,
            },
        },
        csrfToken: {
            name: isDev ? 'next-auth.csrf-token' : '__Host-next-auth.csrf-token',
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                // __Host- cookies must NOT set domain in prod
                ...(isDev ? { secure: false, domain: cookieDomain } : { secure: true }),
            },
        },
    },

    pages: {
        signIn: '/login',
        verifyRequest: '/verify',
        error: '/login',
    },

    callbacks: {
        async signIn({ user, account }) {
            try {
                if (user?.id && account) {
                    await createAuditLog({
                        actorUserId: user.id,
                        actorRole: 'user',
                        action: account.provider === 'google' ? 'LOGIN_GOOGLE' : 'LOGIN_EMAIL',
                        entityType: 'user',
                        entityId: user.id,
                        metadata: { provider: account.provider },
                    })
                }
            } catch (e) {
                console.error('[auth] signIn side-effect failed', e)
            }
            return true
        },

        // ✅ Put custom claims into the JWT so Edge middleware can read them
        // Only query DB on sign-in or explicit update for performance
        async jwt({ token, user, trigger }) {
            try {
                // Only fetch fresh user data on sign-in or explicit update
                if (trigger === 'signIn' || trigger === 'update' || !token.id) {
                    const userId = (user as any)?.id ?? (token as any)?.id
                    if (!userId) return token

                    const userData = await getUserById(String(userId))
                    if (!userData) return token

                        ; (token as any).id = String(userData._id)
                        ; (token as any).role = userData.role
                        ; (token as any).displayName = userData.displayName ?? null
                        ; (token as any).onboardingComplete = userData.onboarding?.isComplete ?? false
                }

                // Otherwise, return cached token (no DB query)
                return token
            } catch (e) {
                console.error('[auth] jwt enrichment failed', e)
                return token
            }
        },

        async session({ session, token }) {
            try {
                if (session.user) {
                    session.user.id = (token as any)?.id
                    session.user.role = (token as any)?.role
                    session.user.displayName = (token as any)?.displayName
                    session.user.onboardingComplete = (token as any)?.onboardingComplete ?? false
                }
            } catch (e) {
                console.error('[auth] session mapping failed', e)
            }
            return session
        },
    },

    debug: isDev,
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)