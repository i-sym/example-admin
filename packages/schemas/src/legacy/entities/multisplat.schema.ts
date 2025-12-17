import { z } from 'zod'
import { DateSchema } from '../utils/date.schema'

export const MultisplatSchema = z.object({
    id: z.string().uuid(),
    sceneId: z.string().uuid(),
    fileName: z.string(),
    fileSize: z.number(),
    numberOfSplats: z.number(),
    createdAt: DateSchema,
    updatedAt: DateSchema,
});

export type MultisplatData = z.infer<typeof MultisplatSchema>;

export const MultisplatUpdateSchema = MultisplatSchema.partial();
export type MultisplatUpdateData = z.infer<typeof MultisplatUpdateSchema>;

export const MultisplatCreateSchema = MultisplatSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type MultisplatCreateData = z.infer<typeof MultisplatCreateSchema>;
