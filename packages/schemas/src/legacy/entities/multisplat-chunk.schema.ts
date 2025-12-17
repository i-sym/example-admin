import { z } from 'zod'

export const MultisplatChunkSchema = z.object({
    id: z.string().uuid(),
    multisplatId: z.string().uuid(),
    chunkIndexX: z.number(),
    chunkIndexY: z.number(),
    fileName: z.string(),
});

export type MultisplatChunkData = z.infer<typeof MultisplatChunkSchema>;

export const MultisplatChunkUpdateSchema = MultisplatChunkSchema.partial();
export type MultisplatChunkUpdateData = z.infer<typeof MultisplatChunkUpdateSchema>;

export const MultisplatChunkCreateSchema = MultisplatChunkSchema.omit({ id: true });
export type MultisplatChunkCreateData = z.infer<typeof MultisplatChunkCreateSchema>;
