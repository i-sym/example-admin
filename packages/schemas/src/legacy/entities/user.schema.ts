import { z } from 'zod'

export const UserTypeSchema = z.enum(['dashboard-user', 'api-user'])

export const UserRoleSchema = z.enum(['admin', 'operator', 'viewer'])

export const UserIdentitySchema = z.discriminatedUnion('type', [
    z.object({
        type: z.literal('dashboard-user'),
        kindeUserId: z.string(),
        email: z.string().email(),
        displayName: z.string().optional(),
    }),
    z.object({
        type: z.literal('api-user'),
        apiTokenHash: z.string(),
        description: z.string(),
        lastUsed: z.date().optional(),
    })
])

export const UserOrganizationMembershipSchema = z.object({
    organizationId: z.string(),
    role: UserRoleSchema,
    permissions: z.array(z.string()),
    createdAt: z.date()
})

export const EmsUserSchema = z.object({
    id: z.string(),
    type: UserTypeSchema,
    identity: UserIdentitySchema,
    isActive: z.boolean().default(true),
    metadata: z.object({
        lastLogin: z.date().optional(),
        loginCount: z.number().int().nonnegative().default(0),
        preferences: z.record(z.unknown()).optional()
    }).optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const EmsUserCreateSchema = EmsUserSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true
})
export const EmsUserUpdateSchema = EmsUserSchema.partial().omit({
    id: true,
    type: true,
    createdAt: true,
    updatedAt: true
})
export type EmsUserData = z.infer<typeof EmsUserSchema>
export type EmsUserCreateData = z.infer<typeof EmsUserCreateSchema>
export type EmsUserUpdateData = z.infer<typeof EmsUserUpdateSchema>
export type UserTypeData = z.infer<typeof UserTypeSchema>
export type UserRoleData = z.infer<typeof UserRoleSchema>
export type UserIdentityData = z.infer<typeof UserIdentitySchema>
export type UserOrganizationMembershipData = z.infer<typeof UserOrganizationMembershipSchema>