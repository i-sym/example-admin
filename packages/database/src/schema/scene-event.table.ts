import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { scenesTable } from './scene.table'

export const sceneEventsTable = pgTable('scene_events', {
    id: uuid('id').primaryKey().defaultRandom(),
    sceneId: uuid('scene_id').notNull().references(() => scenesTable.id, { onDelete: 'cascade' }),
    event: text('event').notNull(), // This should match SceneEventData enum values
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sceneEventsRelations = relations(sceneEventsTable, ({ one }) => ({
    scene: one(scenesTable, {
        fields: [sceneEventsTable.sceneId],
        references: [scenesTable.id],
    }),
}));
