import { implement, ORPCError } from '@orpc/server'

import { usersContract } from '@repo/contracts'
import { UsersModule } from 'src/modules/UsersModule/UsersModule';

const os = implement(usersContract)

const listUsers = os.list.handler(async ({ input, context }) => {
    const res = await UsersModule.getInstance().listUsers();
    return res;
})

const getUser = os.get.handler(async ({ input, context }) => {
    const res = await UsersModule.getInstance().getUserById({ userId: input.params.userId });
    return res;
})

const createUser = os.create.handler(async ({ input, context }) => {
    const res = await UsersModule.getInstance().createUser({ userData: input.body });
    return res;
})

const updateUser = os.update.handler(async ({ input, context }) => {
    const res = await UsersModule.getInstance().updateUser({ userId: input.params.userId, userData: input.body });
    return res;
})

const deleteUser = os.delete.handler(async ({ input, context }) => {
    await UsersModule.getInstance().deleteUser({ userId: input.params.userId });
    return { success: true };
})


export const usersRouter = os.router({
    list: listUsers,
    get: getUser,
    create: createUser,
    update: updateUser,
    delete: deleteUser
});