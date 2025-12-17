import { oc } from '@orpc/contract'
import z from 'zod'
import { usersContract } from './users/users.contract'
import { adminBackendProbeContract } from './probe/admin-backend-probe.contract'


export const adminBackendContract = {
    users: usersContract,
    probe: adminBackendProbeContract,
}