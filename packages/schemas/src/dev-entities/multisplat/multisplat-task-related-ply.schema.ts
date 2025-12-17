import z from "zod";

export const MultisplatTaskRelatedPlySchema = z.object({
    id: z.number().int().nonnegative(),
    taskId: z.number().int().nonnegative(),
    plyFileId: z.number().int().nonnegative(),
    createdAt: z.date(),
});
export type MultisplatTaskRelatedPlyData = z.infer<typeof MultisplatTaskRelatedPlySchema>;

export const MultisplatTaskRelatedPlyCreateSchema = MultisplatTaskRelatedPlySchema.omit({
    id: true,
    createdAt: true,
});
export type MultisplatTaskRelatedPlyCreateData = z.infer<typeof MultisplatTaskRelatedPlyCreateSchema>;

export const MultisplatTaskRelatedPlyUpdateSchema = MultisplatTaskRelatedPlyCreateSchema.partial();
export type MultisplatTaskRelatedPlyUpdateData = z.infer<typeof MultisplatTaskRelatedPlyUpdateSchema>;

export const MultisplatTaskRelatedPlyDetailSchema = MultisplatTaskRelatedPlySchema;
export type MultisplatTaskRelatedPlyDetailData = z.infer<typeof MultisplatTaskRelatedPlyDetailSchema>;
