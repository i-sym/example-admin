
import { parentPort } from 'node:worker_threads';
import fs from 'fs';
import path from 'path';
import { processPlyBuffer } from './convert_ply_to_splat_mc3.js';

parentPort?.on('message', async (msg) => {
    try {
        const { plyFilePath, splatFilePath } = msg;
        const data = fs.readFileSync(plyFilePath);
        const buffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
        const processedData = processPlyBuffer(buffer);
        fs.writeFileSync(splatFilePath, Buffer.from(processedData));
        parentPort?.postMessage({ status: 'success', splatFilePath });
    } catch (err) {
        parentPort?.postMessage({ status: 'error', error: err instanceof Error ? err.message : String(err) });
    }
});
