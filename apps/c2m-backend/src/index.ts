import { config } from "dotenv";
config();

import { serve } from "@hono/node-server";

// import app from "./app";
// import { env } from "./env";

// import './instrumentation';
import { server } from "./orpc/orpc-server";
import { startFileServer } from "./services/ChunkUploder/api/server";
import { ChunkProcessorService } from "./services/ChunkProcessor/ChunkProcessorService";


async function main() {

  try {
    console.log('Starting application...');

    await ChunkProcessorService.getInstance().init();

  } catch (error) {
    console.error('Error:', error);
  }


  server.listen(
    6001,
    'localhost',
    () => console.log(`Listening on localhost:60010`)
  )

  startFileServer();


  console.log('IEC 104 Service initialized');
}


main().catch((error) => {
  console.error('Error occurred:', error);
});


