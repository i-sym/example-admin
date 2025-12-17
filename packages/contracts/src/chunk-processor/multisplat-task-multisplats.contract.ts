
import { oc } from '@orpc/contract'
import z from 'zod'

import { MultisplatCreateSchema, MultisplatDetailSchema, MultisplatSchema } from '@repo/schemas/dev-entities'

const listTaskMultisplats = oc
    .route({ method: 'GET', path: '/tasks/{taskId}/multisplats', inputStructure: 'detailed' })
    .input(z.object({
        params: z.object({
            taskId: z.number().int().nonnegative()
        }),
    }))
    .output(z.array(MultisplatSchema))

const getTask = oc
    .route({ method: 'GET', path: '/tasks/{taskId}', inputStructure: 'detailed' })
    .input(z.object({
        params: z.object({
            taskId: z.number().int().nonnegative()
        }),
    }))
    .output(MultisplatDetailSchema)

const createTask = oc
    .route({ method: 'POST', path: '/tasks', inputStructure: 'detailed' })
    .input(z.object({
        body: MultisplatCreateSchema
    }))
    .output(MultisplatSchema)

export const tasksMultisplatsContract = {
    list: listTaskMultisplats,
    get: getTask,
    create: createTask,
}