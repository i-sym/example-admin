import { pgTable, uuid, primaryKey } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { usersTable } from './user.table'
import { areasTable } from './area.table'

export const userAreaPermissionsTable = pgTable('user_area_permissions', {
    userId: uuid('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
    areaId: uuid('area_id').notNull().references(() => areasTable.id, { onDelete: 'cascade' }),
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.userId, table.areaId] }),
    }
});

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
