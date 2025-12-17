

import path from "path";
import { v4 as uuidv4 } from "uuid";

export class ChunkUploaderService {
    private static instance: ChunkUploaderService;

    private constructor() { }

    public static getInstance(): ChunkUploaderService {
        if (!ChunkUploaderService.instance) {
            ChunkUploaderService.instance = new ChunkUploaderService();
        }
        return ChunkUploaderService.instance;
    }

    public async handleUpload(req: any, options: { filename: string; taskId: string; contentLength?: number }) {


    }
}