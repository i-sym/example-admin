import { localDb, sceneChunksTable, scenesTable } from "@repo/local-database";

import { MultisplatTaskDetailSchema, MultisplatTaskRelatedMultisplatSchema, type MultisplatCreateData, type MultisplatData, type MultisplatDetailData, type MultisplatPlyData, type MultisplatPlyDetailData, type MultisplatTaskCreateData, type MultisplatTaskData, type MultisplatTaskDetailData } from "@repo/schemas/dev-entities";

import fs from 'fs/promises';
import path from 'path';
import { runPlyConversionWorker } from './lib/workerManager';
import { runPlyChunkConversionWorker } from './lib/workerManager';

export class ChunkProcessorService {

    private static instance: ChunkProcessorService;
    private constructor() { }
    public static getInstance(): ChunkProcessorService {
        if (!ChunkProcessorService.instance) {
            ChunkProcessorService.instance = new ChunkProcessorService();
        }
        return ChunkProcessorService.instance;
    }

    public async init() {
        await this.testDb();

    }

    public async prepareSample(): Promise<void> {
        console.log("Preparing sample...");

        await localDb.delete(scenesTable);

        console.log("Deleted existing maps");

        const map = await localDb.insert(scenesTable).values({
            name: 'Sample Scene',
            chunkSideM: 20,
        }).returning();

        console.log("Inserted map:", map);

        // Create chunks

        const chunksList: (typeof sceneChunksTable.$inferInsert)[] = [];

        for (let x = -2; x <= 2; x++) {
            for (let y = -2; y <= 2; y++)
                chunksList.push({
                    sceneId: map[0].id,
                    x,
                    y,
                    file: {
                        key: `sample-chunks/chunk_${x}_${y}.splat`,
                    },
                });
        }

        await localDb.insert(sceneChunksTable).values(chunksList);

    }

    public async testDb(): Promise<void> {
        const maps = await localDb.execute('select version();');
        console.log("Maps:", maps);
    }


}