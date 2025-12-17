import { pgTable, uuid, text, jsonb, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { GeographicalSizeData, GeographicalLocationData } from '@repo/schemas'
import { flightsTable } from './flight.table'
import { scenesTable } from './scene.table'
import { userAreaPermissionsTable } from './user-area-permission.table'

export const areasTable = pgTable('areas', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    size: jsonb('size').$type<GeographicalSizeData>().notNull(),
    location: jsonb('location').$type<GeographicalLocationData>().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const areasRelations = relations(areasTable, ({ many }) => ({
    flights: many(flightsTable),
    scenes: many(scenesTable),
    userAreaPermissions: many(userAreaPermissionsTable),
}));
