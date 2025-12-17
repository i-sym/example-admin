import { serial, text, integer, jsonb, primaryKey } from "drizzle-orm/pg-core";
import { scenesPgSchema } from "./pg-schema";
import { relations } from "drizzle-orm";
import { scenesTable } from "./scenes.table";

export const sceneChunksTable = scenesPgSchema.table("scene_chunks", {
    sceneId: integer("scene_id").notNull().references(() => scenesTable.id),
    x: integer("x").notNull(),
    y: integer("y").notNull(),
    file: jsonb("file").notNull().$type<{ url: string; type: string }>(),
}, (table) => [
    primaryKey({
        columns: [table.sceneId, table.x, table.y],
    }),
]);

export const sceneChunksRelations = relations(sceneChunksTable, ({ many, one }) => ({
    scene: one(scenesTable, {
        fields: [sceneChunksTable.sceneId],
        references: [scenesTable.id],
    }),
}));
