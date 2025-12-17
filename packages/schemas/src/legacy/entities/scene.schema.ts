import { z } from 'zod';
import { DateSchema } from "../utils/date.schema";
import { GeographicalOffsetSchema } from "../utils/geographical.schema";
import { LegacySceneEventLogSchema } from "./scene-event-log.schema";

export const LegacySceneSchema = z.object({
  id: z.string().uuid(),
  areaId: z.string().uuid(),
  flightId: z.string().uuid(),
  name: z.string().nullable(),
  description: z.string().nullable(),
  createdBy: z.string().uuid(),
  sceneFile: z.string().nullable(),
  multisplatId: z.string().uuid().nullable(),
  offset: GeographicalOffsetSchema,
  time: DateSchema,
  createdAt: DateSchema,
  updatedAt: DateSchema,
});

export type LegacySceneData = z.infer<typeof LegacySceneSchema>;

export const LegacySceneUpdateSchema = LegacySceneSchema.partial();
export type LegacySceneUpdateData = z.infer<typeof LegacySceneUpdateSchema>;

export const LegacySceneCreateSchema = LegacySceneSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type LegacySceneCreateData = z.infer<typeof LegacySceneCreateSchema>;

export const LegacySceneWithLastEventSchema = LegacySceneSchema.extend({
  lastEvent: LegacySceneEventLogSchema.nullable(),
});
export type LegacySceneWithLastEventData = z.infer<typeof LegacySceneWithLastEventSchema>;
