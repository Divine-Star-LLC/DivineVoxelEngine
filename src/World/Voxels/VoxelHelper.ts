import type { Util } from "Global/Util.helper";
import type { TextureManagerInterface } from "Meta/World/Textures/TextureManager.interface";
import type {
 VoxelInteface,
 VoxelProcessData,
} from "Meta/World/Voxels/Voxel.types";
import type { VoxelHelperInterface } from "Meta/World/Voxels/VoxelHelper.interface";
import { BuildAmbientOcclusion } from "../WorldData/Functions/ChunkAO.js";
import type { WorldData } from "World/WorldData/WorldData";
import type { VoxelManager } from "./VoxelManager.js";

export class VoxelHelper implements VoxelHelperInterface {
 constructor(
  public util: Util,
  public worldData: WorldData,
  public textureManager: TextureManagerInterface,
  public voxelManager: VoxelManager
 ) {}

 getTrueShapeId(id : string){
     return this.voxelManager.shapeMap[id];
 }

 getTrueFluidShapeId(id : string){
    return this.voxelManager.fluidShapeMap[id];
 }

 processVoxelLight(data: VoxelProcessData, voxel: VoxelInteface): void {
  this.calculateVoxelLight(data,voxel);
  this.calculateVoxelAO(data,voxel);
 }

 calculateVoxelLight(data: VoxelProcessData, voxel: VoxelInteface): void {
  this.worldData.calculdateVoxelLight(
   voxel,
   data.voxelData,
   data.lightTemplate,
   data.exposedFaces,
   data.chunkX,
   data.chunkY,
   data.chunkZ,
   data.x,
   data.y,
   data.z
  );
 }

 calculateVoxelAO(data: VoxelProcessData, voxel: VoxelInteface) {
  if (data.exposedFaces[0]) {
   BuildAmbientOcclusion(
    this.worldData,
    voxel,
    data.aoTemplate,
    data.chunkX,
    data.chunkY,
    data.chunkZ,
    data.x,
    data.y,
    data.z,
    "top"
   );
  }
  if (data.exposedFaces[1]) {
   BuildAmbientOcclusion(
    this.worldData,
    voxel,
    data.aoTemplate,
    data.chunkX,
    data.chunkY,
    data.chunkZ,
    data.x,
    data.y,
    data.z,
    "bottom"
   );
  }
  if (data.exposedFaces[2]) {
   BuildAmbientOcclusion(
    this.worldData,
    voxel,
    data.aoTemplate,
    data.chunkX,
    data.chunkY,
    data.chunkZ,
    data.x,
    data.y,
    data.z,
    "west"
   );
  }
  if (data.exposedFaces[3]) {
   BuildAmbientOcclusion(
    this.worldData,
    voxel,
    data.aoTemplate,
    data.chunkX,
    data.chunkY,
    data.chunkZ,
    data.x,
    data.y,
    data.z,
    "east"
   );
  }
  if (data.exposedFaces[4]) {
   BuildAmbientOcclusion(
    this.worldData,
    voxel,
    data.aoTemplate,
    data.chunkX,
    data.chunkY,
    data.chunkZ,
    data.x,
    data.y,
    data.z,
    "north"
   );
  }
  if (data.exposedFaces[5]) {
   BuildAmbientOcclusion(
    this.worldData,
    voxel,
    data.aoTemplate,
    data.chunkX,
    data.chunkY,
    data.chunkZ,
    data.x,
    data.y,
    data.z,
    "south"
   );
  }
 }
}
