import { z } from 'zod'
import { DateSchema } from '../utils/date.schema'

export const RecordingSchema = z.object({
    id: z.string().uuid(),
    flightId: z.string().uuid(),
    channel: z.string(),
    fileName: z.string(),
    fileSize: z.number().nullable(),
    duration: z.number().nullable(),
    capturedAt: DateSchema.nullable(),
    createdAt: DateSchema,
    updatedAt: DateSchema,
});

export type RecordingData = z.infer<typeof RecordingSchema>;

export const RecordingUpdateSchema = RecordingSchema.partial();
export type RecordingUpdateData = z.infer<typeof RecordingUpdateSchema>;

export const RecordingCreateSchema = RecordingSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type RecordingCreateData = z.infer<typeof RecordingCreateSchema>;
