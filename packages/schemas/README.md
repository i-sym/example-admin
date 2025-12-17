# Schemas Package

This is a package that contains schema/type definitions for all knowledge within platform. Of course, microservices might have their own schemas, but if they need to pull/push something to other services, they should use schemas from this package.

## Schema Definitions

We use Zod for schema definitions. Each schema is defined in its own file, and the file name should match the schema name with a `.schema.ts` suffix. If there are multiple schemas related to the same entity, they should be grouped in the folder and named accordingly.

## Naming Conventions

### File Names
- Use kebab-case for file names (e.g., `simple-user.schema.ts`).
- Include the entity name and the schema type in the file name (e.g., `simple-user-create.schema.ts`).

### Schema Names
- Use PascalCase for schema names (e.g., `SimpleUserSchema`).
- Include the entity name and the schema type in the schema name (e.g., `SimpleUserCreateSchema`).
- Derived types should have `Data` suffix (e.g., `SimpleUserData`).

## Motivation

This is done to ensure consistency across the codebase and to make it easier to find and use schemas. By following these conventions, developers can quickly identify the purpose of a schema and its associated data type.