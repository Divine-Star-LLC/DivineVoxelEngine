import { EngineSettingsData } from "Meta/Global/EngineSettings.types.js";
import { EngineSettings } from "../Global/EngineSettings.js";
import { Util } from "../Global/Util.helper.js";
import { ChunkMeshBuilder } from "./Mesher/ChunkMeshBuilder.js";
import { InitWorker } from "./Init/InitWorker.js";
import { ShapeHelper } from "./Shapes/ShapeHelper.js";
import { ShapeManager } from "./Shapes/ShapeManager.js";

import { MatrixHub } from "../Matrix/MatrixHub.js";
import { WorldMatrix } from "../Matrix/WorldMatrix.js";
import { RenderComm } from "./InterComms/Render/RenderComm.js";
import type { DVEBInitData } from "Meta/Builder/DVEB.js";
import { WorldComm } from "./InterComms/World/WorldComm.js";
import { VoxelManager } from "./Voxels/VoxelManager.js";
import { VoxelHelper } from "./Voxels/VoxelHelper.js";
import { TextureManager } from "./Textures/TextureManager.js";
import { ChunkProcessor } from "./Processor/ChunkProcessor.js";
import { WorldBounds } from "../Global/WorldBounds/WorldBounds.js";

export class DivineVoxelEngineBuilder {
 environment: "node" | "browser" = "browser";
 worker: Worker;
 UTIL: Util = new Util();
 worldMatrix = new WorldMatrix();
 matrixHub = new MatrixHub(this.worldMatrix);

 renderComm = RenderComm;
 worldComm = WorldComm;
 worldBounds = WorldBounds;

 chunkProccesor = new ChunkProcessor(this);
 textureManager = new TextureManager();
 voxelManager = new VoxelManager(this);
 voxelHelper = new VoxelHelper(this);
 __connectedToWorld = false;

 engineSettings: EngineSettings = new EngineSettings();
 shapeManager: ShapeManager = new ShapeManager();
 shapeHelper = new ShapeHelper(this.UTIL);
 chunkMesher = new ChunkMeshBuilder(this);

 syncSettings(data: EngineSettingsData) {
  this.engineSettings.syncSettings(data);
  this.engineSettings.syncSettings(data);
  if (data.chunks) {
   this.worldBounds.setChunkBounds(
    data.chunks.chunkXPow2,
    data.chunks.chunkYPow2,
    data.chunks.chunkZPow2
   );
   this.worldMatrix.syncChunkBounds();
   this.chunkProccesor.syncChunkBounds();
  }
  if (data.regions) {
   this.worldBounds.setRegionBounds(
    data.regions.regionXPow2,
    data.regions.regionYPow2,
    data.regions.regionZPow2
   );
  }
 }
 reStart() {}

 isReady() {
  return this.__connectedToWorld && this.matrixHub.worldPort !== undefined;
 }

 async $INIT(initData: DVEBInitData) {
  await InitWorker(this, initData);
 }

 buildChunk(chunkX: number, chunkY: number, chunkZ: number) {
  const chunk = this.worldMatrix.getChunk(chunkX, chunkY, chunkZ);
  if (!chunk) return false;
  const template = this.chunkProccesor.makeAllChunkTemplates(
   chunk,
   chunkX,
   chunkY,
   chunkZ
  );
  this.chunkMesher.buildChunkMesh(chunkX, chunkY, chunkZ, template);
  return true;
 }
}

//@ts-ignore
export const DVEB = new DivineVoxelEngineBuilder(self as Worker);

//@ts-ignore
if (typeof process !== "undefined" && typeof Worker === "undefined") {
 DVEB.environment = "node";
}
