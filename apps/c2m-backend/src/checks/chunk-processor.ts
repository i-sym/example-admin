import { ChunkProcessorService } from "src/services/ChunkProcessor/ChunkProcessorService";

async function main() {
    console.log("Checking chunk processor...");

    await ChunkProcessorService.getInstance().init();

    await ChunkProcessorService.getInstance().prepareSample();
}

main()