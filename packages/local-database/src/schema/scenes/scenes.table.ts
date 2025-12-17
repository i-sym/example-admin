
import { integer, serial, text } from "drizzle-orm/pg-core";
import { scenesPgSchema } from "./pg-schema";
import { relations } from "drizzle-orm";

export const scenesTable = scenesPgSchema.table("scenes", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    chunkSideM: integer("chunk_side_m").notNull(),
});

export const scenesRelations = relations(scenesTable, ({ many }) => ({

}));