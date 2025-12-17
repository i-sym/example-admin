import { Worker } from 'node:worker_threads';
import path from 'path';
import fs from 'fs/promises';

export function runPlyConversionWorker(plyFilePath: string, splatFilePath: string): Promise<string> {
    const isDev = process.env.NODE_ENV !== 'production';

    console.log(`Moving ply file from ${plyFilePath} to ${splatFilePath}`);
    let worker: Worker;
    return new Promise((resolve, reject) => {

        // Use compiled JS file in production
        const workerPath = path.resolve('src/workers/convertPlyWorker.js');
        worker = new Worker(workerPath);

        worker.postMessage({ plyFilePath, splatFilePath });
        worker.on('message', (msg: any) => {
            if (msg.status === 'success') {
                resolve(msg.splatFilePath);
            } else {
                reject(new Error(msg.error));
            }
            worker.terminate();
        });
        worker.on('error', (err) => {
            reject(err);
            worker.terminate();
        });
    });
}

/**
 * Runs the chunked PLY-to-splat worker, which splits the PLY file into 20x20m chunks and writes splat files to /processed/[name]/[x]_[y].splat
 * @param plyFilePath Path to the input PLY file
 * @param outputDir Directory to write chunked splat files (should be /processed)
 * @returns Promise<string[]> - array of created splat file paths
 */
export function runPlyChunkConversionWorker(plyFilePath: string, outputDir: string): Promise<string[]> {
    const isDev = process.env.NODE_ENV !== 'production';
    console.log(`Chunking ply file from ${plyFilePath} into chunks in ${outputDir}`);
    let worker: Worker;
    return new Promise((resolve, reject) => {
        const workerPath = path.resolve('src/workers/convertPlyChunksWorker.js');
        worker = new Worker(workerPath);
        worker.postMessage({ plyFilePath, outputDir });
        worker.on('message', (msg: any) => {
            if (msg.status === 'success') {
                resolve(msg.files);
            } else {
                reject(new Error(msg.error));
            }
            worker.terminate();
        });
        worker.on('error', (err) => {
            reject(err);
            worker.terminate();
        });
    });
}
