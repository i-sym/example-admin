import { oc } from "@orpc/contract"
import z from "zod"


const getHealthStatus = oc
    .route({ method: 'GET', path: '/controller/health' })
    .input(z.object({}))
    .output(z.object({ status: z.string() }))


export const tilerProbeContract = {
    getHealthStatus,
}