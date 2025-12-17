import z from "zod";

export const MultisplatChunkSchema = z.object({
    id: z.string().min(1),
    multisplatId: z.string().uuid(),
    chunkIndexX: z.number().int(),
    chunkIndexY: z.number().int(),
    fileName: z.string().min(1),
});
export type MultisplatChunkData = z.infer<typeof MultisplatChunkSchema>;

export const MultisplatChunkCreateSchema = MultisplatChunkSchema.omit({
    id: true,
});
export type MultisplatChunkCreateData = z.infer<typeof MultisplatChunkCreateSchema>;

export const MultisplatChunkUpdateSchema = MultisplatChunkCreateSchema.partial();
export type MultisplatChunkUpdateData = z.infer<typeof MultisplatChunkUpdateSchema>;

export const MultisplatChunkDetailSchema = MultisplatChunkSchema;
export type MultisplatChunkDetailData = z.infer<typeof MultisplatChunkDetailSchema>;
