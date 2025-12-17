import { oc } from "@orpc/contract"
import z from "zod"
import { SceneCreateSchema, SceneDetailsSchema, ScenePreviewListSchema, SceneRenderingConfigSchema, SceneSchema, SceneUpdateSchema } from "@repo/schemas"

const listScenes = oc
    .route({ method: 'GET', path: '/scenes', inputStructure: 'detailed' })
    .input(z.object({}))
    .output(ScenePreviewListSchema)

const getSceneDetails = oc
    .route({ method: 'GET', path: '/scenes/{sceneId}', inputStructure: 'detailed' })
    .input(z.object({
        params: z.object({
            sceneId: z.string()
        })
    }))
    .output(SceneDetailsSchema)

// const createScene = oc
//     .route({ method: 'POST', path: '/ply-files', inputStructure: 'detailed' })
//     .input(z.object({
//         body: SceneCreateSchema
//     }))
//     .output(SceneSchema)

// const updateScene = oc
//     .route({ method: 'PUT', path: '/ply-files/{sceneId}', inputStructure: 'detailed' })
//     .input(z.object({
//         params: z.object({ sceneId: z.string() }),
//         body: SceneUpdateSchema
//     }))
//     .output(SceneSchema)

// const deleteScene = oc
//     .route({ method: 'DELETE', path: '/ply-files/{sceneId}', inputStructure: 'detailed' })
//     .input(z.object({
//         params: z.object({ sceneId: z.string() })
//     }))
//     .output(z.object({ success: z.boolean() }))

export const getSceneRenderingConfig = oc
    .route({ method: 'GET', path: '/scenes/{sceneId}/rendering/config', inputStructure: 'detailed' })
    .input(z.object({
        params: z.object({ sceneId: z.string() })
    }))
    .output(SceneRenderingConfigSchema)


export const scenesContract = {
    list: listScenes,
    getDetails: getSceneDetails,
    // create: createScene,
    // update: updateScene,
    // delete: deleteScene,
    rendering: {
        getConfig: getSceneRenderingConfig
    }

}