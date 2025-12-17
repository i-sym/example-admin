import z from "zod";

export const CloudRunnerTaskSchema = z.object({
    id: z.number(),
});
export type CloudRunnerTaskData = z.infer<typeof CloudRunnerTaskSchema>;