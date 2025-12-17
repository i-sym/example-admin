import z from "zod"

export const PlyFileAnalysisResultSchema = z.object({
    filePath: z.string(),
    vertexCount: z.number(),
})
export type PlyFileAnalysisResultData = z.infer<typeof PlyFileAnalysisResultSchema>


export const PlyFileAnalysisStateSchema = z.discriminatedUnion('status', [
    z.object({ status: z.literal('missing') }),
    z.object({ status: z.literal('in-progress'), progress: z.number().min(0).max(1) }),
    z.object({ status: z.literal('completed'), result: PlyFileAnalysisResultSchema }),
    z.object({ status: z.literal('failed'), error: z.string() }),
])
export type PlyFileAnalysisStateData = z.infer<typeof PlyFileAnalysisStateSchema>

