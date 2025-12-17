
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

const listPods = oc
    .route({ method: 'GET', path: '/kube/pods', inputStructure: 'detailed' })
    .input(z.object({}))
    .output(z.any())

const getPodLogs = oc
    .route({ method: 'GET', path: '/kube/pods/{podId}/logs', inputStructure: 'detailed' })
    .input(z.object({
        params: z.object({
            podId: z.string()
        }),
    }))
    .output(z.any())

const getPodDescription = oc
    .route({ method: 'GET', path: '/kube/pods/{podId}/description', inputStructure: 'detailed' })
    .input(z.object({
        params: z.object({
            podId: z.string()
        }),
    }))
    .output(z.any())

const getPodTop = oc
    .route({ method: 'GET', path: '/kube/pods/{podId}/top', inputStructure: 'detailed' })
    .input(z.object({
        params: z.object({
            podId: z.string()
        }),
    }))
    .output(z.any())

const killPod = oc
    .route({ method: 'POST', path: '/kube/pods/{podId}/kill', inputStructure: 'detailed' })
    .input(z.object({
        params: z.object({
            podId: z.string()
        }),
    }))
    .output(z.any())

const stopPod = oc
    .route({ method: 'POST', path: '/kube/pods/{podId}/stop', inputStructure: 'detailed' })
    .input(z.object({
        params: z.object({
            podId: z.string()
        }),
    }))
    .output(z.any())

const listJobs = oc
    .route({ method: 'GET', path: '/kube/jobs', inputStructure: 'detailed' })
    .input(z.object({}))
    .output(z.any())

const getJobDescription = oc
    .route({ method: 'GET', path: '/kube/jobs/{jobId}/description', inputStructure: 'detailed' })
    .input(z.object({
        params: z.object({
            jobId: z.string()
        }),
    }))
    .output(z.any())

const listPvcs = oc
    .route({ method: 'GET', path: '/kube/pvcs', inputStructure: 'detailed' })
    .input(z.object({}))
    .output(z.any())

const listPvs = oc
    .route({ method: 'GET', path: '/kube/pvs', inputStructure: 'detailed' })
    .input(z.object({}))
    .output(z.any())


export const kubeContract = {
    pods: {
        list: listPods,
        getLogs: getPodLogs,
        getDescription: getPodDescription,
        getTop: getPodTop,
        kill: killPod,
        stop: stopPod,
    },
    jobs: {
        list: listJobs,
        getDescription: getJobDescription,
    },
    pvcs: {
        list: listPvcs,
    },
    pvs: {
        list: listPvs,
    },
}