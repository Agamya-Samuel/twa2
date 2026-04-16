import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from './schema'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const connectionString = process.env.DATABASE_URL

// Parse connection string to add SSL options for production databases
// Format: mysql://user:password@host:port/database
const url = new URL(connectionString)

const connectionConfig = {
  host: url.hostname,
  port: parseInt(url.port) || 3306,
  user: url.username,
  password: url.password,
  database: url.pathname.replace('/', ''),
  // Enable SSL with options to handle self-signed certificates
  ssl: {
    rejectUnauthorized: false,
  },
}

// Create MySQL connection pool
const pool = mysql.createPool(connectionConfig)

// Export drizzle instance
export const db = drizzle(pool, { schema })

// Export schema for use in queries
export { schema }
