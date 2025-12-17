import { z } from 'zod'

export const UserAreaPermissionSchema = z.object({
    userId: z.string().uuid(),
    areaId: z.string().uuid(),
});

export type UserAreaPermissionData = z.infer<typeof UserAreaPermissionSchema>;

export const UserAreaPermissionUpdateSchema = UserAreaPermissionSchema.partial();
export type UserAreaPermissionUpdateData = z.infer<typeof UserAreaPermissionUpdateSchema>;

export const UserAreaPermissionCreateSchema = UserAreaPermissionSchema;
export type UserAreaPermissionCreateData = z.infer<typeof UserAreaPermissionCreateSchema>;
