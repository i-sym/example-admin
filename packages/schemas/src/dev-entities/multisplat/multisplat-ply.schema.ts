import z from "zod";

export const MultisplatPlySchema = z.object({
    id: z.number(),
    plyFileId: z.number(),
    // PlyIndexX: z.number().int(),
    // PlyIndexY: z.number().int(),
    fileName: z.string().min(1),
});
export type MultisplatPlyData = z.infer<typeof MultisplatPlySchema>;

export const MultisplatPlyCreateSchema = MultisplatPlySchema.omit({
    id: true,
});
export type MultisplatPlyCreateData = z.infer<typeof MultisplatPlyCreateSchema>;

export const MultisplatPlyUpdateSchema = MultisplatPlyCreateSchema.partial();
export type MultisplatPlyUpdateData = z.infer<typeof MultisplatPlyUpdateSchema>;

export const MultisplatPlyDetailSchema = MultisplatPlySchema;
export type MultisplatPlyDetailData = z.infer<typeof MultisplatPlyDetailSchema>;
