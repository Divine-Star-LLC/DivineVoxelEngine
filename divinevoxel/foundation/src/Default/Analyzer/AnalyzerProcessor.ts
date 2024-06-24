import type { LocationData } from "@divinevoxel/core/Math";;
import { WorldSpaces } from "@divinevoxel/core/Data/World/WorldSpaces.js";
import { ColumnDataTool } from "../Tools/Data/WorldData/ColumnDataTool.js";
import { HeightMapTool } from "../Tools/Data/WorldData/HeightMapTool.js";
import { ChunkDataTool } from "../Tools/Data/WorldData/ChunkDataTool.js";
import { WorldRegister } from "../../Data/World/WorldRegister.js";
const columnTool = new ColumnDataTool();
const heightMapTool = new HeightMapTool();
const chunkTool = new ChunkDataTool();
export const AnalyzerProcessor = {
  columnTool: columnTool,
  chunkTool: chunkTool,
  goThroughColumn<T>(
    location: LocationData,
    run: (x: number, y: number, z: number, column: ColumnDataTool) => void
  ) {
    if (!columnTool.setLocation(location).loadIn()) return;
    WorldRegister.instance.cache.enable();
    const column = columnTool.getColumn();
    let maxX = WorldSpaces.chunk._bounds.x + location[1];
    let maxZ = WorldSpaces.chunk._bounds.z + location[3];
    for (const chunk of column.chunks) {
      heightMapTool.chunk.setChunk(chunk);
      chunkTool.setChunk(chunk);
      const [dimension, cx, cy, cz] = chunkTool.getLocationData();
      let [minY, maxY] = heightMapTool.chunk.getMinMax();
      minY += cy;
      maxY += cy + 1;
      for (let y = minY; y < maxY; y += 1) {
        for (let z = cz; z < maxZ; z += 1) {
          for (let x = cx; x < maxX; x += 1) {
            run(x, y, z, columnTool);
          }
        }
      }
    }
    WorldRegister.instance.cache.disable();
  },
};
