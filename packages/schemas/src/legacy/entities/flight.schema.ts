import { z } from 'zod'
import { DateSchema } from '../utils/date.schema'

export const FlightSchema = z.object({
    id: z.string().uuid(),
    areaId: z.string().uuid(),
    startTime: DateSchema,
    createdAt: DateSchema,
    updatedAt: DateSchema,
});

export type FlightData = z.infer<typeof FlightSchema>;

export const FlightUpdateSchema = FlightSchema.partial();
export type FlightUpdateData = z.infer<typeof FlightUpdateSchema>;

export const FlightCreateSchema = FlightSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type FlightCreateData = z.infer<typeof FlightCreateSchema>;
