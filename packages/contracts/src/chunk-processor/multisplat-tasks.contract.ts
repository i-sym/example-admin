
import { oc } from '@orpc/contract'
import z from 'zod'

import { MultisplatTaskCreateSchema, MultisplatTaskDetailSchema, MultisplatTaskSchema } from '@repo/schemas/dev-entities'
import { tasksMultisplatsContract } from './multisplat-task-multisplats.contract'
import { tasksPlyFilesContract } from './multisplat-ply-files.contract'

const listTasks = oc
    .route({ method: 'GET', path: '/tasks', inputStructure: 'detailed' })
    .input(z.object({}))
    .output(z.object({
        items: z.array(MultisplatTaskSchema),
    }))

const getTask = oc
    .route({ method: 'GET', path: '/tasks/{taskId}', inputStructure: 'detailed' })
    .input(z.object({
        params: z.object({
            taskId: z.number().int().nonnegative()
        }),
    }))
    .output(MultisplatTaskDetailSchema)

const createTask = oc
    .route({ method: 'POST', path: '/tasks', inputStructure: 'detailed' })
    .input(z.object({
        body: MultisplatTaskCreateSchema
    }))
    .output(MultisplatTaskSchema)

const deleteTask = oc
    .route({ method: 'DELETE', path: '/tasks/{taskId}', inputStructure: 'detailed' })
    .input(z.object({
        params: z.object({
            taskId: z.number().int().nonnegative()
        }),
    }))
    .output(z.object({
        success: z.boolean()
    }))

export const tasksContract = {
    list: listTasks,
    get: getTask,
    create: createTask,
    delete: deleteTask,
    multisplats: tasksMultisplatsContract,
    plyFiles: tasksPlyFilesContract,
}