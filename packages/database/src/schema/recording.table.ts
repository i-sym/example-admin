import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { flightsTable } from './flight.table'

export const recordingsTable = pgTable('recordings', {
    id: uuid('id').primaryKey().defaultRandom(),
    flightId: uuid('flight_id').notNull().references(() => flightsTable.id, { onDelete: 'cascade' }),
    channel: text('channel').notNull(),
    fileName: text('file_name').notNull(),
    fileSize: integer('file_size'),
    duration: integer('duration'),
    capturedAt: timestamp('captured_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const recordingsRelations = relations(recordingsTable, ({ one }) => ({
    flight: one(flightsTable, {
        fields: [recordingsTable.flightId],
        references: [flightsTable.id],
    }),
}));
