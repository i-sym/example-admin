import { pgTable, uuid, text, jsonb, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { GeographicalOffsetData } from '@repo/schemas'
import { areasTable } from './area.table'
import { flightsTable } from './flight.table'
import { usersTable } from './user.table'
import { multisplatsTable } from './multisplat.table'
import { sceneEventsTable } from './scene-event.table'

export const scenesTable = pgTable('scenes', {
    id: uuid('id').primaryKey().defaultRandom(),
    areaId: uuid('area_id').notNull().references(() => areasTable.id, { onDelete: 'cascade' }),
    flightId: uuid('flight_id').notNull().references(() => flightsTable.id, { onDelete: 'cascade' }),
    name: text('name'),
    sceneFile: text('scene_file'),
    description: text('description'),
    createdBy: uuid('created_by').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
    multisplatId: uuid('multisplat_id'), // Optional - can be set later
    offset: jsonb('offset').$type<GeographicalOffsetData>().notNull(),
    time: timestamp('time').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const scenesRelations = relations(scenesTable, ({ one, many }) => ({
    area: one(areasTable, {
        fields: [scenesTable.areaId],
        references: [areasTable.id],
    }),
    flight: one(flightsTable, {
        fields: [scenesTable.flightId],
        references: [flightsTable.id],
    }),
    createdByUser: one(usersTable, {
        fields: [scenesTable.createdBy],
        references: [usersTable.id],
    }),
    multisplats: many(multisplatsTable),
    events: many(sceneEventsTable),
}));
