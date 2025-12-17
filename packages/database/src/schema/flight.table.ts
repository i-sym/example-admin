import { pgTable, uuid, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { areasTable } from './area.table'
import { recordingsTable } from './recording.table'
import { scenesTable } from './scene.table'

export const flightsTable = pgTable('flights', {
    id: uuid('id').primaryKey().defaultRandom(),
    areaId: uuid('area_id').notNull().references(() => areasTable.id, { onDelete: 'cascade' }),
    startTime: timestamp('start_time').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const flightsRelations = relations(flightsTable, ({ one, many }) => ({
    area: one(areasTable, {
        fields: [flightsTable.areaId],
        references: [areasTable.id],
    }),
    recordings: many(recordingsTable),
    scenes: many(scenesTable),
}));
