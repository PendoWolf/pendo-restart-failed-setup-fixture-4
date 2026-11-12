import * as pendo from "pendo-server-sdk";
import { createApp } from "./app.js";

// Pendo Agent Analytics: records the Tripwise Assistant's turns (agent "writeAssistantReply").
// Set PENDO_DISABLED=true in the environment to turn it off.
pendo.init({
  apiKey: "cd8b4218-b34f-4801-8088-f97112300a5e",
  agentId: "FEwyh2bbVEr2o6LIyrO6IuGHaqc",
  endpoint: "https://app.pendo-dev.pendo-dev.com",
  autoPatch: true,
});

const port = Number(process.env.PORT) || 3001;
const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";

const server = createApp(corsOrigin).listen(port, () => {
  console.log(`Tripwise API on port ${port}, allowing ${corsOrigin}`);
});

// Send Pendo's buffered events before the process exits.
async function stop(): Promise<void> {
  server.close();
  await pendo.shutdown();
  process.exit(0);
}
process.on("SIGINT", () => {
  void stop();
});
process.on("SIGTERM", () => {
  void stop();
});
