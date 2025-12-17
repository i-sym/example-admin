import z from "zod"

export const SceneChunkSchema = z.object({
    sceneId: z.string(),
    chunkX: z.number(),
    chunkY: z.number(),
    fileName: z.string(),
})
export type SceneChunkData = z.infer<typeof SceneChunkSchema>

