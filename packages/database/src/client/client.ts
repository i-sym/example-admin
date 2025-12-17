import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './../schema'

export { eq, and, or } from 'drizzle-orm'

export function createDatabaseClient(connectionString: string) {
    const sql = postgres(connectionString, {
        ssl: {
            rejectUnauthorized: false,
        }
    })
    return drizzle(sql, { schema })
}

export const db = createDatabaseClient(process.env.DATABASE_URL!)


export type DatabaseClient = ReturnType<typeof createDatabaseClient>

