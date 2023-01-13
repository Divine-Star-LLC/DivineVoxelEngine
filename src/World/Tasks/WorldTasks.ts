import type { LocationData } from "Meta/Data/CommonTypes";
import { ThreadComm } from "../../Libs/ThreadComm/ThreadComm.js";
//data
import { WorldRegister } from "../../Data/World/WorldRegister.js";
import { WorldDataGenerator } from "../Data/Generators/WorldDataGenerator.js";
import { DataSync } from "../Data/DataSync.js";
import {
 LoadRegionHeadertasks,
 LoadWorldDataTasks,
} from "Meta/Tasks/Tasks.types.js";
import { RegionDataTool } from "../../Tools/Data/WorldData/RegionDataTool.js";
import { ColumnDataTool } from "../../Tools/Data/WorldData/ColumnDataTool.js";
import { ChunkDataTool } from "../../Tools/Data/WorldData/ChunkDataTool.js";
import { RegionHeaderRegister } from "../../Data/World/Region/RegionHeaderRegister.js";

const regionTool = new RegionDataTool();
const columnTool = new ColumnDataTool();
const chunkTool = new ChunkDataTool();

export const WorldTasks = {
 addChunk: ThreadComm.registerTasks("add-chunk", (data: LocationData) => {
  const chunk = WorldRegister.chunk.get(data);
  if (!chunk) {
   const chunkData = WorldDataGenerator.chunk.create();
   WorldRegister.chunk.add(data, chunkData);
  } else {
   DataSync.chunk.sync(data);
  }
 }),
 unLoad: {
  unLoadColumn: ThreadComm.registerTasks<LocationData>(
   "unload-column",
   (data) => {
    DataSync.column.unSync(data);
    WorldRegister.column.remove(data);
   }
  ),
 },
 load: {
  loadRegino: ThreadComm.registerTasks<LoadWorldDataTasks>(
   "load-region",
   (data) => {
    regionTool.setBuffer(data[0]);
    const location = regionTool.getLocationData();
    WorldRegister.region.add(location, data[0]);
    DataSync.region.sync(location);
   }
  ),
  loadReginoHeader: ThreadComm.registerTasks<LoadRegionHeadertasks>(
   "load-region-header",
   (data) => {
    RegionHeaderRegister.add(data[0], data[1]);
    const location = data[0];
    DataSync.regionHeader.sync(location);
   }
  ),
  loadColumn: ThreadComm.registerTasks<LoadWorldDataTasks>(
   "load-column",
   (data) => {
    columnTool.setBuffer(data[0]);
    const location = columnTool.getLocationData();
    WorldRegister.column.add(location, data[0]);
    DataSync.column.sync(location);
   }
  ),
  loadChunk: ThreadComm.registerTasks<LoadWorldDataTasks>(
   "load-chunk",
   (data) => {
    chunkTool.setBuffer(data[0]);
    const location = chunkTool.getLocationData();
    WorldRegister.chunk.add(location, data[0]);
    DataSync.chunk.sync(location);
   }
  ),
 },
};
