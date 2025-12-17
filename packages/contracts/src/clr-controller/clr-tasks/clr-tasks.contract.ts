import { oc } from '@orpc/contract'
import z from 'zod'


// const listPlyFiles = oc
//     .route({ method: 'GET', path: '/tasks/{taskId}/ply-files', inputStructure: 'detailed' })
//     .input(z.object({
//         params: z.object({
//             taskId: z.number().int().nonnegative()
//         }),
//     }))
//     .output(z.array(MultisplatPlySchema))

const listTasks = oc
    .route({ method: 'GET', path: '/tasks', inputStructure: 'detailed' })
    .input(z.object({}))
    .output(z.any())

const createTask = oc
    .route({ method: 'POST', path: '/tasks', inputStructure: 'detailed' })
    .input(z.object({
        body: z.object({
            name: z.string(),
        }),
    }))
    .output(z.any())

const getTaskDetails = oc
    .route({ method: 'GET', path: '/tasks/{taskId}/details', inputStructure: 'detailed' })
    .input(z.object({
        params: z.object({
            taskId: z.string()
        }),
    }))
    .output(z.any())

const createTaskPvc = oc
    .route({ method: 'POST', path: '/tasks/{taskId}/create-pvc', inputStructure: 'detailed' })
    .input(z.object({
        params: z.object({
            taskId: z.string()
        }),
        body: z.object({}),
    }))
    .output(z.any())

const checkCuda = oc
    .route({ method: 'POST', path: '/tasks/{taskId}/check-cuda', inputStructure: 'detailed' })
    .input(z.object({
        params: z.object({
            taskId: z.string()
        }),
        body: z.object({}),
    }))
    .output(z.any())


const startJob = oc
    .route({ method: 'POST', path: '/tasks/{taskId}/jobs/{jobName}/start', inputStructure: 'detailed' })
    .input(z.object({
        params: z.object({
            taskId: z.string(),
            jobName: z.enum(['download', 'ingressor', 'sfm', 'splatatizer', 'upload'])
        }),
        body: z.object({}),
    }))
    .output(z.any())

const getJobStatus = oc
    .route({ method: 'GET', path: '/tasks/{taskId}/jobs/{jobName}/status', inputStructure: 'detailed' })
    .input(z.object({
        params: z.object({
            taskId: z.string(),
            jobName: z.enum(['download', 'ingressor', 'sfm', 'splatatizer', 'upload'])
        }),
    }))
    .output(z.any())

const cleanupTaskResources = oc
    .route({ method: 'POST', path: '/tasks/{taskId}/cleanup', inputStructure: 'detailed' })
    .input(z.object({
        params: z.object({
            taskId: z.string()
        }),
        body: z.object({}),
    }))
    .output(z.any())

const startUtil = oc
    .route({ method: 'POST', path: '/tasks/{taskId}/utils/{utilName}/start', inputStructure: 'detailed' })
    .input(z.object({
        params: z.object({
            taskId: z.string(),
            utilName: z.string()
        }),
        body: z.object({}),
    }))
    .output(z.any())

export const clrTasksContract = {
    listTasks,
    createTask,
    getTaskDetails,
    createTaskPvc,
    startJob,
    getJobStatus,
    cleanupTaskResources,
    checkCuda,
    startUtil,
}