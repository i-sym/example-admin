import { pgTable, uuid, varchar, jsonb, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const emsUsersTable = pgTable('ems_users', {
    id: uuid('id').primaryKey().defaultRandom(),
    identity: jsonb('identity').notNull(), // UserIdentityData
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const emsUsersRelations = relations(emsUsersTable, ({ many }) => ({

}))
