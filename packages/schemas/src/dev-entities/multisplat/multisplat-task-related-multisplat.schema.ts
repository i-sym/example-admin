import z from "zod";

export const MultisplatTaskRelatedMultisplatSchema = z.object({
    id: z.number().int().nonnegative(),
    taskId: z.number().int().nonnegative(),
    multisplatId: z.string().uuid(),
    createdAt: z.date(),
});
export type MultisplatTaskRelatedMultisplatData = z.infer<typeof MultisplatTaskRelatedMultisplatSchema>;

export const MultisplatTaskRelatedMultisplatCreateSchema = MultisplatTaskRelatedMultisplatSchema.omit({
    id: true,
    createdAt: true,
});
export type MultisplatTaskRelatedMultisplatCreateData = z.infer<typeof MultisplatTaskRelatedMultisplatCreateSchema>;

export const MultisplatTaskRelatedMultisplatUpdateSchema = MultisplatTaskRelatedMultisplatCreateSchema.partial();
export type MultisplatTaskRelatedMultisplatUpdateData = z.infer<typeof MultisplatTaskRelatedMultisplatUpdateSchema>;

export const MultisplatTaskRelatedMultisplatDetailSchema = MultisplatTaskRelatedMultisplatSchema;
export type MultisplatTaskRelatedMultisplatDetailData = z.infer<typeof MultisplatTaskRelatedMultisplatDetailSchema>;
