import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { userAreaPermissionsTable } from './user-area-permission.table'
import { scenesTable } from './scene.table'

export const usersTable = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    kindeId: text('kinde_id').notNull().unique(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
    userAreaPermissions: many(userAreaPermissionsTable),
    createdScenes: many(scenesTable),
}));
