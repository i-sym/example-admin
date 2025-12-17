import { oc } from '@orpc/contract'
import z from 'zod'
import { tilerProbeContract } from './tiler-probe.contract'
import { plyFilesContract } from './ply-files/ply-files.contract'
import { scenesContract } from './scenes/scenes.contract'


export const tilerContract = {
    scenes: scenesContract,
    plyFiles: plyFilesContract,
    probe: tilerProbeContract,
}