import { z } from 'zod';

// Schema for granting area access by email
export const AreaPermissionGrantSchema = z.object({
  areaId: z.string().uuid(),
  email: z.string().email(),
});

export type AreaPermissionGrantData = z.infer<typeof AreaPermissionGrantSchema>;

// Schema for removing area access
export const AreaPermissionRevokeSchema = z.object({
  areaId: z.string().uuid(),
  userId: z.string().uuid(),
});

export type AreaPermissionRevokeData = z.infer<
  typeof AreaPermissionRevokeSchema
>;

// Response schema for permission operations
export const AreaPermissionResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  user: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
      email: z.string().email(),
    })
    .optional(),
});

export type AreaPermissionResponseData = z.infer<
  typeof AreaPermissionResponseSchema
>;
