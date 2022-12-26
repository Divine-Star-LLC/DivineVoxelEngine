import {
 DVEMessageHeader,
 WorldDataHeaders,
} from "../../../Data/Constants/DataHeaders.js";
import { ChunkDataTags } from "../Tags/ChunkTags.js";
import { ColumnDataTags } from "../Tags/ColumnTags.js";
import { RegionDataTags } from "../Tags/RegionTags.js";

export const WorldDataGenerator = {
 convertToSAB(buffer: ArrayBuffer) {
  const sab = new SharedArrayBuffer(buffer.byteLength);
  const temp = new Uint8Array(buffer);
  const temp2 = new Uint8Array(sab);
  temp2.set(temp, 0);
  return sab;
 },
 chunk: {

  create(buffer: ArrayBuffer | false = false): SharedArrayBuffer {
   if (buffer) {
    return WorldDataGenerator.convertToSAB(buffer);
   }

   const newBuffer = new SharedArrayBuffer(ChunkDataTags.tagSize);
   ChunkDataTags.setBuffer(newBuffer);
   ChunkDataTags.setTag("#dve_header", DVEMessageHeader);
   ChunkDataTags.setTag("#dve_data_type", WorldDataHeaders.chunk);
   return newBuffer;
  },
 },
 column: {

  create(buffer: ArrayBuffer | false = false): SharedArrayBuffer {
   if (buffer) {
    return WorldDataGenerator.convertToSAB(buffer);
   }
   const newBuffer = new SharedArrayBuffer(ColumnDataTags.tagSize);
   ColumnDataTags.setBuffer(newBuffer);
   ColumnDataTags.setTag("#dve_header", DVEMessageHeader);
   ColumnDataTags.setTag("#dve_data_type", WorldDataHeaders.column);
   return newBuffer;
  },
 },
 region: {

  create(buffer: ArrayBuffer | false = false): SharedArrayBuffer {
   if (buffer) {
    return WorldDataGenerator.convertToSAB(buffer);
   }
   const newBuffer = new SharedArrayBuffer(RegionDataTags.tagSize);
   RegionDataTags.setBuffer(newBuffer);
   RegionDataTags.setTag("#dve_header", DVEMessageHeader);
   RegionDataTags.setTag("#dve_data_type", WorldDataHeaders.region);
   return newBuffer;
  },
 },
};
