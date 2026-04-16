import type { Config } from 'drizzle-kit'
import { config } from 'dotenv'

config()

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const url = new URL(process.env.DATABASE_URL)

export default {
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.replace('/', ''),
    ssl: {
      rejectUnauthorized: false,
    },
  },
} satisfies Config
