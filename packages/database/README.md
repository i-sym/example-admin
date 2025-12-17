# Database

This package contains the database schema definitions and guidelines for using Drizzle ORM.

## Schema Definitions

Each table should have its own file, and the file name should match the table name with a `.table.ts` suffix. Follow the naming conventions outlined in the [guidelines](guidelines.md).

## Motivation

If there are multiple microservices that use the same database, they might conflict if each has own drizzle schema. To avoid this, we have a single database package that contains all the schemas. This way, each microservice can import the necessary schemas without conflicts.

Also there is a single `db` object that should be used to interact with the database. It is created in the `src/client/client.ts` file and exported from there. This ensures that all microservices use the same database connection and configuration.

## Development

### Pushing Changes
BE VERY CAREFUL, right now there are no safety mechanisms to prevent you from breaking the database schema.

If you wish to update database schema follow drizzle documentation. If you are too lazy to read it, here is a short guide:

1. Make sure you are in root of this package. If need, run:
```
cd packages/database
```
2. Generate new migration file:
```
yarn drizzle-kit generate
```
3. Apply the migration to the database:
```
yarn drizzle-kit push
```

### Viewing

If you want to run drizzle studio to view the database schema, you can do so by running from root of the package:
```
yarn drizzle-kit studio
```

## Usage
To use the database schema in your microservice, import the necessary tables from the `database` package. For example:

```ts
import { usersTable } from '@repo/database/schema';
import { db, eq } from '@repo/database/client';

async function getUser({ id }: { id: string }) {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, id),
  
  });
}
