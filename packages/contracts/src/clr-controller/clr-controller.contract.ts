import { oc } from '@orpc/contract'
import z from 'zod'
import { kubeContract } from './kube'
import { clrTasksContract } from './clr-tasks'


export const clrControllerContract = {
    kube: kubeContract,
    clrTasks: clrTasksContract,
}