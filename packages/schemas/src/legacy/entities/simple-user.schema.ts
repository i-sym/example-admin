import { z } from 'zod'
import { DateSchema } from '../utils/date.schema'

export const SimpleUserSchema = z.object({
    id: z.string().uuid(),
    kindeId: z.string(),
    name: z.string(),
    email: z.string().email(),
    createdAt: DateSchema,
    updatedAt: DateSchema,
});

export type SimpleUserData = z.infer<typeof SimpleUserSchema>;

export const SimpleUserUpdateSchema = SimpleUserSchema.partial();
export type SimpleUserUpdateData = z.infer<typeof SimpleUserUpdateSchema>;

export const SimpleUserCreateSchema = SimpleUserSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type SimpleUserCreateData = z.infer<typeof SimpleUserCreateSchema>;
