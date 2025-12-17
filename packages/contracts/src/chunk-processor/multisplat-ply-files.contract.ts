
import { oc } from '@orpc/contract'
import z from 'zod'

import { MultisplatCreateSchema, MultisplatDetailSchema, MultisplatPlyDetailSchema, MultisplatPlySchema, MultisplatSchema } from '@repo/schemas/dev-entities'

const listPlyFiles = oc
    .route({ method: 'GET', path: '/tasks/{taskId}/ply-files', inputStructure: 'detailed' })
    .input(z.object({
        params: z.object({
            taskId: z.number().int().nonnegative()
        }),
    }))
    .output(z.array(MultisplatPlySchema))

const getPlyFileDetails = oc
    .route({ method: 'GET', path: '/tasks/{taskId}/ply-files/{fileId}', inputStructure: 'detailed' })
    .input(z.object({
        params: z.object({
            taskId: z.number().int().nonnegative(),
            fileId: z.number().int().nonnegative()
        }),
    }))
    .output(MultisplatPlyDetailSchema)

const beginConversion = oc
    .route({ method: 'POST', path: '/tasks/{taskId}/ply-files/{fileId}/conversion/begin', inputStructure: 'detailed' })
    .input(z.object({
        params: z.object({
            taskId: z.number().int().nonnegative(),
            fileId: z.number().int().nonnegative()
        }),
    }))
    .output(z.object({
        success: z.boolean()
    }))


export const tasksPlyFilesContract = {
    list: listPlyFiles,
    get: getPlyFileDetails,
    conversion: {
        begin: beginConversion,
    }
}