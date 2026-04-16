import { DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: 'user' | 'admin'
      editCount?: number
    } & DefaultSession['user']
  }

  interface User {
    role?: 'user' | 'admin'
    editCount?: number
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: 'user' | 'admin'
    editCount?: number
  }
}
