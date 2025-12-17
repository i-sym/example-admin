import { z } from 'zod'

export const LegacySceneEventSchema = z.enum([
    'created',
    'processing_started',
    'processing_completed',
    'processing_failed',
    'published',
    'archived',
    'deleted'
]);

export type LegacySceneEventData = z.infer<typeof LegacySceneEventSchema>;
