import { pgTable, text, integer, uuid } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { multisplatsTable } from './multisplat.table'

export const multisplatChunksTable = pgTable('multisplat_chunks', {
    id: text('id').primaryKey(),
    multisplatId: uuid('multisplat_id').notNull().references(() => multisplatsTable.id, { onDelete: 'cascade' }),
    chunkIndexX: integer('chunk_index_x').notNull(),
    chunkIndexY: integer('chunk_index_y').notNull(),
    fileName: text('file_name').notNull(),
});

export const multisplatChunksRelations = relations(multisplatChunksTable, ({ one }) => ({
    multisplat: one(multisplatsTable, {
        fields: [multisplatChunksTable.multisplatId],
        references: [multisplatsTable.id],
    }),
}));
