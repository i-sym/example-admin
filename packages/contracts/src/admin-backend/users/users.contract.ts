import { oc } from "@orpc/contract"
import z from "zod"

import { UserCreateSchema, UserCreateData, UserPreviewListSchema, UserPreviewListData, UserPreviewSchema, UserPreviewData, UserUpdateSchema, UserUpdateData } from "@repo/schemas"
import { success } from "zod/v4"

const listUsers = oc
    .route({ method: 'GET', path: '/users', inputStructure: 'detailed' })
    .input(z.object({}))
    .output(UserPreviewListSchema)

const getUser = oc
    .route({ method: 'GET', path: '/users/{userId}', inputStructure: 'detailed' })
    .input(z.object({ 
        params: z.object({ userId: z.coerce.number() })
     }))
    .output(UserPreviewSchema)

const createUser = oc
    .route({ method: 'POST', path: '/users', inputStructure: 'detailed' })
    .input(z.object({
        body: UserCreateSchema,
    }))
    .output(UserPreviewSchema)

const updateUser = oc
    .route({ method: 'PUT', path: '/users/{userId}', inputStructure: 'detailed' })
    .input(z.object({
        params: z.object({ userId: z.coerce.number() }),
        body: UserUpdateSchema,
    }))
    .output(UserPreviewSchema)

const deleteUser = oc
    .route({ method: 'DELETE', path: '/users/{userId}', inputStructure: 'detailed' })
    .input(z.object({
        params: z.object({ userId: z.coerce.number() }),
    }))
    .output(z.object({
        success: z.boolean(),
    })) 

export const usersContract = {
    list: listUsers,
    get: getUser,
    create: createUser,
    update: updateUser,
    delete: deleteUser
}