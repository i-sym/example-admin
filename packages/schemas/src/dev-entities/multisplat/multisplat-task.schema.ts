import z from "zod";
import { MultisplatTaskEventSchema } from "./multisplat-task-event.schema";
import { MultisplatTaskRelatedMultisplatSchema } from "./multisplat-task-related-multisplat.schema";
import { MultisplatTaskRelatedPlySchema } from "./multisplat-task-related-ply.schema";

export const MultisplatTaskSchema = z.object({
    id: z.number().int().nonnegative(),
    name: z.string().min(1).max(255),
    createdAt: z.date(),
    updatedAt: z.date(),
});
export type MultisplatTaskData = z.infer<typeof MultisplatTaskSchema>;

export const MultisplatTaskCreateSchema = MultisplatTaskSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export type MultisplatTaskCreateData = z.infer<typeof MultisplatTaskCreateSchema>;

export const MultisplatTaskUpdateSchema = MultisplatTaskCreateSchema.partial();
export type MultisplatTaskUpdateData = z.infer<typeof MultisplatTaskUpdateSchema>;

export const MultisplatTaskDetailSchema = MultisplatTaskSchema.and(z.object({
    events: z.array(MultisplatTaskEventSchema),
    relatedMultisplats: z.array(MultisplatTaskRelatedMultisplatSchema),
    relatedPlys: z.array(MultisplatTaskRelatedPlySchema),
}));
export type MultisplatTaskDetailData = z.infer<typeof MultisplatTaskDetailSchema>;