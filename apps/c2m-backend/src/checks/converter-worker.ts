import { ChunkProcessorService } from "src/services/ChunkProcessor/ChunkProcessorService";
import { runPlyChunkConversionWorker } from "src/services/ChunkProcessor/lib/workerManager";

async function main() {
    console.log("Checking chunk processor...");
    runPlyChunkConversionWorker(
        // 'uploads/raw/tractor.ply',
        'uploads/raw/trenches-18M.ply',
        'uploads/processed/'
    )
}

main()