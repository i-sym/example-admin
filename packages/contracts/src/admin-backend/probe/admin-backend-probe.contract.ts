import { oc } from "@orpc/contract"
import z from "zod"


const getHealthStatus = oc
    .route({ method: 'GET', path: '/health' })
    .input(z.object({}))
    .output(z.object({ status: z.string() }))


export const adminBackendProbeContract = {
    getHealthStatus,
}