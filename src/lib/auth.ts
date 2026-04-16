import { NextAuthOptions } from 'next-auth'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { OAuthConfig } from 'next-auth/providers/oauth'
import { db } from '@/db'
import { accounts, sessions, users } from '@/db/schema'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
  }),
  providers: [
    // Google Provider - configure in .env.local
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    // GitHub Provider - configure in .env.local
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    // MediaWiki Wikipedia OAuth 2.0
    ({
      id: 'mediawiki',
      name: 'Wikipedia',
      type: 'oauth',
      authorization: {
        url: 'https://meta.wikimedia.org/w/rest.php/oauth2/authorize',
        params: {
          grant_type: 'authorization_code',
          response_type: 'code',
        },
      },
      token: 'https://meta.wikimedia.org/w/rest.php/oauth2/access_token',
      userinfo: {
        url: 'https://meta.wikimedia.org/w/rest.php/oauth2/resource',
        async request({ tokens, provider }: any) {
          const response = await fetch(provider.userinfo.url!, {
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
              'User-Agent': 'WikiQuest/1.0 (https://wikiquest.example.com; contact@wikiquest.example.com)',
            },
          })
          return response.json()
        },
      },
      profile(profile: any) {
        return {
          id: profile.sub,
          name: profile.username,
          email: profile.email || `${profile.username}@wikipedia.org`,
          image: profile.logo,
          editCount: profile.edit_count,
        }
      },
      clientId: process.env.MEDIAWIKI_CLIENT_ID || '',
      clientSecret: process.env.MEDIAWIKI_CLIENT_SECRET || '',
      checks: ['none'],
    } as OAuthConfig<any>),
    // Credentials Provider - for email/password login
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        // For now, this is a placeholder implementation
        // You'll need to implement proper user lookup and password verification
        // const user = await db.query.users.findFirst({
        //   where: eq(users.email, credentials.email)
        // })

        // if (!user || !user.password) {
        //   throw new Error('Invalid credentials')
        // }

        // const isCorrectPassword = await bcrypt.compare(
        //   credentials.password,
        //   user.password
        // )

        // if (!isCorrectPassword) {
        //   throw new Error('Invalid credentials')
        // }

        // return user

        return null
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role || 'user'
        token.editCount = user.editCount
      }

      // Handle session updates
      if (trigger === 'update' && session) {
        token.role = session.user.role
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'user' | 'admin'
        session.user.editCount = token.editCount as number
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // Allow sign in for all providers
      return true
    },
  },
  debug: process.env.NODE_ENV === 'development',
}
