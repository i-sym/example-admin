import { UserPreviewData, UserPreviewListData, UserUpdateData } from "@repo/schemas";

export class UsersModule {
    private static instance: UsersModule;

    public async createUser({ userData }: { userData: UserUpdateData }): Promise<UserPreviewData> {
        return {
            id: 1,
            name: userData.name || "Default Name",
            email: userData.email || "default@example.com"
        }
    }

    public async getUserById({ userId }: { userId: number }): Promise<UserPreviewData> {
        throw new Error("Method not implemented.");
    }

    public async updateUser({ userId, userData }: { userId: number; userData: UserUpdateData }): Promise<UserPreviewData> {
        throw new Error("Method not implemented.");
    }

    public async deleteUser({ userId }: { userId: number }): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async listUsers(): Promise<UserPreviewListData> {
        return {
            users: [
                {
                    id: 1,
                    name: "John Doe",
                    email: "john.doe@example.com"
                }
            ]
        };
    }

    private constructor() {}

    public static getInstance(): UsersModule {
        if (!UsersModule.instance) {
            UsersModule.instance = new UsersModule();
        }
        return UsersModule.instance;
    }

    public async init(): Promise<void> {

    }


}