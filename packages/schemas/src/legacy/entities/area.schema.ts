import { z } from 'zod'
import { DateSchema } from '../utils/date.schema'
import { GeographicalSizeSchema, GeographicalLocationSchema } from '../utils/geographical.schema'

export const AreaSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string(),
    size: GeographicalSizeSchema,
    location: GeographicalLocationSchema,
    createdAt: DateSchema,
    updatedAt: DateSchema,
});

export type AreaData = z.infer<typeof AreaSchema>;

export const AreaUpdateSchema = AreaSchema.partial();
export type AreaUpdateData = z.infer<typeof AreaUpdateSchema>;

export const AreaCreateSchema = AreaSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type AreaCreateData = z.infer<typeof AreaCreateSchema>;
