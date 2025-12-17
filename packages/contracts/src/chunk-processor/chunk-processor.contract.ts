import { oc } from '@orpc/contract'
import z from 'zod'
import { tasksContract } from './multisplat-tasks.contract'


const health = oc
    .route({ method: 'GET', path: '/controller/health' })
    .input(z.object({}))
    .output(z.object({ status: z.string() }))

export const chunkProcessorContract = {
    chunkProcessor: {
        health: health,
        tasks: tasksContract,
    }
}