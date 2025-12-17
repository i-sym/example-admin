import z from "zod"
import { SceneChunkSchema } from "./scene-chunk.schema"

export const SceneSchema = z.object({
    id: z.string(),
    name: z.string(),
})
export type SceneData = z.infer<typeof SceneSchema>


export const ScenePreviewSchema = SceneSchema.extend({})
export type ScenePreviewData = z.infer<typeof ScenePreviewSchema>


export const ScenePreviewListSchema = z.object({
    items: z.array(ScenePreviewSchema)
})
export type ScenePreviewListData = z.infer<typeof ScenePreviewListSchema>


export const SceneDetailsSchema = SceneSchema.extend({})
export type SceneDetailsData = z.infer<typeof SceneDetailsSchema>


export const SceneCreateSchema = SceneSchema.omit({ id: true })
export type SceneCreateData = z.infer<typeof SceneCreateSchema>


export const SceneUpdateSchema = SceneSchema.omit({ id: true })
export type SceneUpdateData = z.infer<typeof SceneUpdateSchema>


export const SceneRenderingConfigSchema = z.object({
    scene: SceneSchema,
    chunks: z.array(SceneChunkSchema)
})
export type SceneRenderingConfigData = z.infer<typeof SceneRenderingConfigSchema>