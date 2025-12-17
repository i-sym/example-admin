import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { scenesTable } from './scene.table'
import { multisplatChunksTable } from './multisplat-chunk.table'

export const multisplatsTable = pgTable('multisplats', {
    id: uuid('id').primaryKey().defaultRandom(),
    sceneId: uuid('scene_id').notNull().references(() => scenesTable.id, { onDelete: 'cascade' }),
    fileName: text('file_name').notNull(),
    fileSize: integer('file_size').notNull(),
    numberOfSplats: integer('number_of_splats').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const multisplatsRelations = relations(multisplatsTable, ({ one, many }) => ({
    scene: one(scenesTable, {
        fields: [multisplatsTable.sceneId],
        references: [scenesTable.id],
    }),
    chunks: many(multisplatChunksTable),
}));
