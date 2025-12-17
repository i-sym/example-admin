import {z} from "zod";

export const UserSchema = z.object({
    id: z.number(),
    name: z.string().min(1),
    email: z.string().email(),
    role: z.enum(['admin', 'editor', 'viewer']),
});
export type UserData = z.infer<typeof UserSchema>;


export const UserPreviewSchema = UserSchema.pick({
    id: true,
    name: true,
    email: true,
});
export type UserPreviewData = z.infer<typeof UserPreviewSchema>;

export const UserPreviewListSchema = z.object({
    users: z.array(UserPreviewSchema),
});
export type UserPreviewListData = z.infer<typeof UserPreviewListSchema>;

export const UserCreateSchema = UserSchema.omit({ id: true });
export type UserCreateData = z.infer<typeof UserCreateSchema>;

export const UserUpdateSchema = UserSchema.partial().omit({ id: true });
export type UserUpdateData = z.infer<typeof UserUpdateSchema>;