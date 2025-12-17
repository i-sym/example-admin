import { oc } from "@orpc/contract"
import z from "zod"
import { PlyFileCreateSchema, PlyFileDetailsSchema, PlyFilePreviewListSchema, PlyFileSchema, PlyFileUpdateSchema } from "@repo/schemas"
import { PlyFileAnalysisResultSchema } from "@repo/schemas"


const listPlyFiles = oc
    .route({ method: 'GET', path: '/ply-files', inputStructure: 'detailed' })
    .input(z.object({}))
    .output(PlyFilePreviewListSchema)

const getPlyFileDetails = oc
    .route({ method: 'GET', path: '/ply-files/{plyFileId}', inputStructure: 'detailed' })
    .input(z.object({
        params: z.object({
            plyFileId: z.string()
        })
    }))
    .output(PlyFileDetailsSchema)

const createPlyFile = oc
    .route({ method: 'POST', path: '/ply-files', inputStructure: 'detailed' })
    .input(z.object({
        body: PlyFileCreateSchema
    }))
    .output(PlyFileSchema)

const updatePlyFile = oc
    .route({ method: 'PUT', path: '/ply-files/{plyFileId}', inputStructure: 'detailed' })
    .input(z.object({
        params: z.object({ plyFileId: z.string() }),
        body: PlyFileUpdateSchema
    }))
    .output(PlyFileSchema)

const deletePlyFile = oc
    .route({ method: 'DELETE', path: '/ply-files/{plyFileId}', inputStructure: 'detailed' })
    .input(z.object({
        params: z.object({ plyFileId: z.string() })
    }))
    .output(z.object({ success: z.boolean() }))


const getPlyFileAnalysisState = oc
    .route({ method: 'GET', path: '/ply-files/{plyFileId}/analysis/state', inputStructure: 'detailed' })
    .input(z.object({
        params: z.object({ plyFileId: z.string() })
    }))
    .output(PlyFileAnalysisResultSchema)

const startPlyFileAnalysis = oc
    .route({ method: 'POST', path: '/ply-files/{plyFileId}/analysis/start', inputStructure: 'detailed' })
    .input(z.object({
        params: z.object({ plyFileId: z.string() }),
        body: z.object({})
    }))
    .output(z.object({ success: z.boolean() }))

export const plyFilesContract = {
    list: listPlyFiles,
    getDetails: getPlyFileDetails,
    create: createPlyFile,
    update: updatePlyFile,
    delete: deletePlyFile,
    getAnalysisState: getPlyFileAnalysisState,
    startAnalysis: startPlyFileAnalysis
}