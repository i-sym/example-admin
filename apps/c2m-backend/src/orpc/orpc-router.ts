import type { IncomingHttpHeaders } from 'node:http'
import { ORPCError, os } from '@orpc/server'
import * as z from 'zod'

const health = os
    .route({ method: 'GET', path: '/health' })
    .input(z.object({}))
    .handler(async () => {
        return { status: 'ok' }
    })


export const router = {
    health,
}
