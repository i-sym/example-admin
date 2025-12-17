# Guidelines for Schemas

When creating schemas, use Zod as base and infer type from it. Use `Schema` and `Data` suffixes for schema and data types respectively and to avoid conflicts with classes

```ts
import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string().uuid(),
  kindeId: z.string(),
  name: z.string(),
  email: z.string().email(),
  createdAt: DateSchema,
});

export type UserData = z.infer<typeof UserSchema>;
```

Name file as `user.schema.ts` and always keep schemas in the `schemas` directory.

If it is a schema that has record in database it should have base schema `UserSchema` and then extend it with additional properties for the database to have:
- UserUpdateSchema for updates
- UserCreateSchema for creation

Use extend or omit to create these schemas.

```ts
export const UserUpdateSchema = UserSchema.partial();
export type UserUpdateData = z.infer<typeof UserUpdateSchema>;

export const UserCreateSchema = UserSchema.omit({ id: true, createdAt: true });
export type UserCreateData = z.infer<typeof UserCreateSchema>;
```