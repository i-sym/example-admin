import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../schema'

export { eq, and, or } from 'drizzle-orm'



export const localDb = drizzle(
    postgres("", {
        ssl: {
            rejectUnauthorized: false,
        }
    }),
    { schema }
)

export function getDatabaseClient(databaseUrl: string) {
    return drizzle(
        postgres(databaseUrl, {
            ssl: {
                rejectUnauthorized: false,
            }
        }),
        { schema }
    )
}
export type DatabaseClient = typeof localDb

