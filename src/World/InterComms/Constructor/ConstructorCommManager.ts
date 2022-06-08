//types
import type {
 InterCommInterface,
 InterCommPortTypes,
} from "Meta/Comms/InterComm.types";
//comms
import { GetNewConstructorComm } from "./ConstructorComm.js";
import { DVEW } from "../../DivineVoxelEngineWorld.js";
import { VoxelSubstanceType } from "Meta/index.js";
import { WorldToConstructorMessages } from "../../../Shared/InterComms/WorldToConstructor.js";

/**# World Gen Comm Manager
 * ---
 * Handles all world gen comms. .
 */
export const ConstructorCommManager = {
 count: 0,
 numConstructors: 0,

 __numLightUpdates: 0,

 constructors: <InterCommInterface[]>[],

 constructorsConnected: 0,

 $INIT(statesSAB: SharedArrayBuffer) {
  for (const constructor of this.constructors) {
   constructor.sendMessage(WorldToConstructorMessages.setQueueStates, [
    statesSAB,
   ]);
  }
 },

 addThread(port: InterCommPortTypes) {
  const newComm = GetNewConstructorComm(this.numConstructors + 1, port);
  this.constructors.push(newComm);
 },

 syncChunkInAllThreads(chunkX: number, chunkY: number, chunkZ: number) {
  for (const constructor of this.constructors) {
   DVEW.matrixCentralHub.syncChunkInThread(
    constructor.name,
    chunkX,
    chunkY,
    chunkZ
   );
  }
 },

 releaseChunkInAllThreads(chunkX: number, chunkY: number, chunkZ: number) {
  for (const constructor of this.constructors) {
   DVEW.matrixCentralHub.releaseChunkInThread(
    constructor.name,
    chunkX,
    chunkY,
    chunkZ
   );
  }
 },

 syncRegionInAllThreads(regionX: number, regionY: number, regionZ: number) {
  for (const constructor of this.constructors) {
   DVEW.matrixCentralHub.syncRegionInThread(
    constructor.name,
    regionX,
    regionY,
    regionZ
   );
  }
 },

 releaseRegionInAllThreads(regionX: number, regionY: number, regionZ: number) {
  for (const constructor of this.constructors) {
   DVEW.matrixCentralHub.releaseRegionInThread(
    constructor.name,
    regionX,
    regionY,
    regionZ
   );
  }
 },

 isReady() {
  if (!this.constructorsConnected) return false;
  if (this.constructorsConnected < this.numConstructors) return false;
  return true;
 },

 __handleCount() {
  this.count++;
  if (this.count >= this.numConstructors) {
   this.count = 0;
  }
 },

 requestFullChunkBeBuilt(chunkX: number, chunkY: number, chunkZ: number) {
  const comm = this.constructors[this.count];
  DVEW.queues._numChunksRebuilding++;
  comm.sendMessage(WorldToConstructorMessages.buildChunk, [
   chunkX,
   chunkY,
   chunkZ,
  ]);
  this.__handleCount();
 },
 runRGBFloodFillAt(x: number, y: number, z: number) {
  const comm = this.constructors[this.count];
  comm.sendMessage(WorldToConstructorMessages.RGBlightUpdate, [x, y, z]);
  this.__handleCount();
 }, 
 runRGBFloodRemoveAt(x: number, y: number, z: number) {
  const comm = this.constructors[this.count];
  comm.sendMessage(WorldToConstructorMessages.RGBlightRemove, [x, y, z]);
  this.__handleCount();
 },
 runSunLightForWorldColumn(x: number, z: number, maxY: number) {
  const comm = this.constructors[this.count];
  comm.sendMessage(WorldToConstructorMessages.fillWorldColumnWithSunLight, [
   x,
   z,
   maxY,
  ]);
  this.__handleCount();
 },
 runSunFillAtMaxY(x: number, y: number, maxY: number) {
  const comm = this.constructors[this.count];
  comm.sendMessage(WorldToConstructorMessages.runSunLightUpdateAtMaxY, [
   x,
   y,
   maxY,
  ]);
  this.__handleCount();
 },
 runSunFillAt(x: number, y: number, z: number) {
  const comm = this.constructors[this.count];
  comm.sendMessage(WorldToConstructorMessages.sunLightUpdate, [x, y, z]);
  this.__handleCount();
 },
 runSunRemoveAt(x: number, y: number, z: number) {
  const comm = this.constructors[this.count];
  comm.sendMessage(WorldToConstructorMessages.sunLightRemove, [x, y, z]);
  this.__handleCount();
 },
};
