import { relations } from 'drizzle-orm'
import { usersTable } from './user.table'
import { areasTable } from './area.table'
import { userAreaPermissionsTable } from './user-area-permission.table'
import { flightsTable } from './flight.table'
import { recordingsTable } from './recording.table'
import { scenesTable } from './scene.table'
import { sceneEventsTable } from './scene-event.table'
import { multisplatsTable } from './multisplat.table'
import { multisplatChunksTable } from './multisplat-chunk.table'

export const usersRelations = relations(usersTable, ({ many }) => ({
    userAreaPermissions: many(userAreaPermissionsTable),
    createdScenes: many(scenesTable),
}));

export const areasRelations = relations(areasTable, ({ many }) => ({
    flights: many(flightsTable),
    scenes: many(scenesTable),
    userAreaPermissions: many(userAreaPermissionsTable),
}));

export const userAreaPermissionsRelations = relations(userAreaPermissionsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [userAreaPermissionsTable.userId],
        references: [usersTable.id],
    }),
    area: one(areasTable, {
        fields: [userAreaPermissionsTable.areaId],
        references: [areasTable.id],
    }),
}));

export const flightsRelations = relations(flightsTable, ({ one, many }) => ({
    area: one(areasTable, {
        fields: [flightsTable.areaId],
        references: [areasTable.id],
    }),
    recordings: many(recordingsTable),
    scenes: many(scenesTable),
}));

export const recordingsRelations = relations(recordingsTable, ({ one }) => ({
    flight: one(flightsTable, {
        fields: [recordingsTable.flightId],
        references: [flightsTable.id],
    }),
}));

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

export const sceneEventsRelations = relations(sceneEventsTable, ({ one }) => ({
    scene: one(scenesTable, {
        fields: [sceneEventsTable.sceneId],
        references: [scenesTable.id],
    }),
}));

export const multisplatsRelations = relations(multisplatsTable, ({ one, many }) => ({
    scene: one(scenesTable, {
        fields: [multisplatsTable.sceneId],
        references: [scenesTable.id],
    }),
    chunks: many(multisplatChunksTable),
}));

export const multisplatChunksRelations = relations(multisplatChunksTable, ({ one }) => ({
    multisplat: one(multisplatsTable, {
        fields: [multisplatChunksTable.multisplatId],
        references: [multisplatsTable.id],
    }),
}));
