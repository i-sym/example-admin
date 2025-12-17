import { implement, ORPCError } from '@orpc/server'
import * as z from 'zod'

import { usersRouter } from 'src/orpc/routes/users/users.routes'
import { adminBackendContract } from '@repo/contracts'

const os = implement(adminBackendContract)

const health = os.probe.getHealthStatus
    .handler(async () => {
        return { status: 'ok' }
    })


export const router = os.router({
    probe: {
        getHealthStatus: health,
    },
    users: usersRouter,
})