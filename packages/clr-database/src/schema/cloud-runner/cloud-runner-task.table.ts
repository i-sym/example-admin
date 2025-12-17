import { serial, timestamp, text } from "drizzle-orm/pg-core";
import { cloudRunnerPgSchema } from "./pgSchema";
import { relations } from "drizzle-orm";
import { create } from "domain";

export const cloudRunnerTaskTable = cloudRunnerPgSchema.table("cloud_runner_task", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    completedAt: timestamp("completed_at")
})

export const cloudRunnerTaskRelations = relations(cloudRunnerTaskTable, ({ one, many }) => ({

}));