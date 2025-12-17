export class StorageManagementService {

    private static instance: StorageManagementService;

    private constructor() {
        // Private constructor to prevent direct instantiation
    }

    public static getInstance(): StorageManagementService {
        if (!StorageManagementService.instance) {
            StorageManagementService.instance = new StorageManagementService();
        }

        return StorageManagementService.instance;
    }

    public async init() {
        // Initialization logic here
    }
}