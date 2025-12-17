import z from "zod"

export const PlyFileSchema = z.object({
    id: z.string(),
    name: z.string(),
    filename: z.string()
})
export type PlyFileData = z.infer<typeof PlyFileSchema>


export const PlyFilePreviewSchema = PlyFileSchema.extend({})
export type PlyFilePreviewData = z.infer<typeof PlyFilePreviewSchema>


export const PlyFilePreviewListSchema = z.object({
    items: z.array(PlyFilePreviewSchema)
})
export type PlyFilePreviewListData = z.infer<typeof PlyFilePreviewListSchema>


export const PlyFileDetailsSchema = PlyFileSchema.extend({})
export type PlyFileDetailsData = z.infer<typeof PlyFileDetailsSchema>


export const PlyFileCreateSchema = PlyFileSchema.omit({ id: true })
export type PlyFileCreateData = z.infer<typeof PlyFileCreateSchema>


export const PlyFileUpdateSchema = PlyFileSchema.omit({ id: true })
export type PlyFileUpdateData = z.infer<typeof PlyFileUpdateSchema>



