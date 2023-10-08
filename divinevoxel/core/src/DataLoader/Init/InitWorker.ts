import type { DivineVoxelEngineData } from "DataLoader/DivineVoxelEngineDataLoader";
import { DataLoaderThreadState } from "../Threads/DataLoaderThreadState.js";
import { ThreadComm } from "@divinestar/threads/";
export async function InitWorker(DVED: DivineVoxelEngineData) {
 let parent = "render";
 if (DVED.environment == "node") {
  parent = "server";
 }
 await ThreadComm.$INIT("data-loader", parent);

 await DVED.UTIL.createPromiseCheck({
  check: () => {
   return DataLoaderThreadState.isReady();
  },
  checkInterval: 1,
 });
}
