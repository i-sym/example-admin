import { z } from 'zod'
import { DateSchema } from '../utils/date.schema'
import { LegacySceneEventSchema } from './scene-event.schema'

export const LegacySceneEventLogSchema = z.object({
    id: z.string().uuid(),
    legacysceneId: z.string().uuid(),
    event: LegacySceneEventSchema,
    createdAt: DateSchema,
});

export type LegacySceneEventLogData = z.infer<typeof LegacySceneEventLogSchema>;

export const LegacySceneEventLogUpdateSchema = LegacySceneEventLogSchema.partial();
export type LegacySceneEventLogUpdateData = z.infer<typeof LegacySceneEventLogUpdateSchema>;

export const LegacySceneEventLogCreateSchema = LegacySceneEventLogSchema.omit({ id: true, createdAt: true });
export type LegacySceneEventLogCreateData = z.infer<typeof LegacySceneEventLogCreateSchema>;
