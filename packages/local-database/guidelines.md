# Database Guidelines

Use Drizzle ORM for database schema definitions. Each table should have its own file, and the file name should match the table name with a `.table.ts` suffix. If there are multiple tables related to the same entity, they should be grouped in a folder and named accordingly.

## Naming Conventions

### Table Naming Conventions
- Use singular nouns for table names (e.g., `user` instead of `users`).
- Use snake_case for table names (e.g., `user_profile`).

### Column Naming Conventions
- Use snake_case for column names (e.g., `first_name`).
- Include the table name as a prefix for column names (e.g., `user_id`).

## Important Notes

If it is a JSON field, use type from schemas package and pass it into `$type` function to ensure type safety.

```ts
import { UserDetailsData } from `@repo/schemas`

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  details: jsonb('details', { mode: 'json' }).$type<UserDetailsData>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});
```

Do not forget about `createdAt` and `updatedAt` fields.
Do not forget about `.notNull()` for required fields.
Do not forget about `.unique()` for unique fields.  
Do not forget about relations:

```ts
export const emsUsersTable = pgTable('ems_users', {
    id: uuid('id').primaryKey().defaultRandom(),
    identity: jsonb('identity').notNull(), // UserIdentityData
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const emsUsersRelations = relations(emsUsersTable, ({ many }) => ({

}))
```

Important: KEEP RELATIONS IN THE SAME FILE AS TABLE DEFINITION.

Do not forget about `.references()` for foreign keys and onDelete actions.