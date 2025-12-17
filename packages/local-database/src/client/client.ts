import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../schema'

export { eq, and, or } from 'drizzle-orm'



export const localDb = drizzle(
    postgres("postgresql://postgres:EdDR5eJHQtuRrZP4lYyi@exp-c2s-database.cvomgs4cssx5.eu-north-1.rds.amazonaws.com:5432/c2m-internal?sslmode=no-verify", {
        ssl: {
            rejectUnauthorized: false,
        }
    }),
    { schema }
)

export type DatabaseClient = typeof localDb

