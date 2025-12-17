

import express from 'express';
import cors from 'cors';

import { ChunkUploaderService } from '../ChunkUploaderService';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 6004;

app.use(cors());

// File upload endpoint (streaming, no multer)
app.post('/upload', async (req, res) => {
    try {
        const contentLength = req.headers['content-length'] ? parseInt(req.headers['content-length'], 10) : undefined;
        if (contentLength && contentLength > 2 * 1024 * 1024 * 1024) {
            return res.status(413).json({ error: 'File too large' });
        }

        try {
            let contentLength: number | undefined = undefined;
            const contentLengthHeader = req.headers['content-length'];
            if (typeof contentLengthHeader === 'string') {
                contentLength = parseInt(contentLengthHeader, 10);
            }
            if (typeof contentLength === 'number' && contentLength > 2 * 1024 * 1024 * 1024) {
                return res.status(413).json({ error: 'File too large' });
            }

            let filename: string = `upload-${Date.now()}`;
            const xFilename = req.headers['x-filename'];
            if (Array.isArray(xFilename) && xFilename.length > 0 && typeof xFilename[0] === 'string') {
                filename = xFilename[0];
            } else if (typeof xFilename === 'string' && xFilename.length > 0) {
                filename = xFilename;
            }

            let sceneId: string = uuidv4();
            const xSceneId = req.headers['x-scene-id'];
            if (Array.isArray(xSceneId) && xSceneId.length > 0 && typeof xSceneId[0] === 'string') {
                sceneId = xSceneId[0];
            } else if (typeof xSceneId === 'string' && xSceneId.length > 0) {
                sceneId = xSceneId;
            }

            const uploader = ChunkUploaderService.getInstance();
            const result = await uploader.handleUpload(req, { filename, taskId: sceneId, contentLength });
            res.json(result);

        } catch (err) {
            // Optionally log failed event here if needed
            res.status(500).json({ error: (err as Error).message });
        }
    } catch (err) {
        // Optionally log failed event here if needed
        res.status(500).json({ error: (err as Error).message });
    }
});


// Large file download endpoint (streaming)
// GET /download/:id/:fragmentId
import path from 'path';
import fs from 'fs';

app.get('/download/:id/:fragmentId', (req, res) => {
    const { id, fragmentId } = req.params;
    // Sanitize input to prevent path traversal
    if (!/^[\w-]+$/.test(id) || !/^[\w.-]+$/.test(fragmentId)) {
        return res.status(400).json({ error: 'Invalid file path' });
    }
    const filePath = path.resolve(process.cwd(), 'uploads', 'processed', id, fragmentId);
    if (!filePath.startsWith(path.resolve(process.cwd(), 'uploads', 'processed'))) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            return res.status(404).json({ error: 'File not found' });
        }
        res.setHeader('Content-Length', stats.size);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${fragmentId}"`);
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
        readStream.on('error', (streamErr) => {
            res.status(500).json({ error: 'Error reading file' });
        });
    });
});

export function startFileServer() {
    app.listen(6003, () => {
        console.log(`File Server listening on port 6003`);
    });
}
