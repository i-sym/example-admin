import z from "zod";

export const MultisplatTaskEventSchema = z.object({
    id: z.number().int().nonnegative(),
    taskId: z.number().int().nonnegative(),
    eventType: z.string().min(1).max(50),
    eventData: z.unknown(),
    createdAt: z.date(),
});
export type MultisplatTaskEventData = z.infer<typeof MultisplatTaskEventSchema>;

export const MultisplatTaskEventCreateSchema = MultisplatTaskEventSchema.omit({
    id: true,
    createdAt: true,
});
export type MultisplatTaskEventCreateData = z.infer<typeof MultisplatTaskEventCreateSchema>;

export const MultisplatTaskEventUpdateSchema = MultisplatTaskEventCreateSchema.partial();
export type MultisplatTaskEventUpdateData = z.infer<typeof MultisplatTaskEventUpdateSchema>;

export const MultisplatTaskEventDetailSchema = MultisplatTaskEventSchema;
export type MultisplatTaskEventDetailData = z.infer<typeof MultisplatTaskEventDetailSchema>;
