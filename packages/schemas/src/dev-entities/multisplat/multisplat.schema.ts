import z from "zod";

export const MultisplatSchema = z.object({
    id: z.string().uuid(),
    fileName: z.string().min(1),
    fileSize: z.number().int().nonnegative(),
    numberOfSplats: z.number().int().nonnegative(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
export type MultisplatData = z.infer<typeof MultisplatSchema>;

export const MultisplatCreateSchema = MultisplatSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export type MultisplatCreateData = z.infer<typeof MultisplatCreateSchema>;

export const MultisplatUpdateSchema = MultisplatCreateSchema.partial();
export type MultisplatUpdateData = z.infer<typeof MultisplatUpdateSchema>;

// Details schema will be extended later with relations if needed
export const MultisplatDetailSchema = MultisplatSchema;
export type MultisplatDetailData = z.infer<typeof MultisplatDetailSchema>;
