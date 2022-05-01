import type {
 VoxelInteface,
 VoxelData,
} from "Meta/Voxels/Voxel.types.js";
import type { WorldData } from "World/WorldData/WorldData";
import { DVEB } from "../../DivineVoxelEngineBuilder.js";

export function OcculsionCalcuation(
 voxel: VoxelData,
 voxelX: number,
 voxelY: number,
 voxelZ: number,
 x: number,
 y: number,
 z: number
) {
 const check = DVEB.worldMatrix.getVoxel(x + voxelX, y + voxelY, z + voxelZ);

 if (!check) {
  return 1;
 }
 if (check[0] == "dve:air") {
  return 1;
 }

 const checkVoxel = DVEB.voxelManager.getVoxel(check[0]);

 if (checkVoxel.data.substance !== voxel.substance) {
  return 1;
 }
 return 0.75;
}

export function BuildAmbientOcclusion(
 voxel: VoxelData,
 amientOcculusionTemplate: number[],
 chunkX: number,
 chunkY: number,
 chunkZ: number,
 x: number,
 y: number,
 z: number,
 face: "top" | "bottom" | "north" | "east" | "west" | "south"
) {
 const trueX = chunkX + x;
 const trueY = chunkY + y;
 const trueZ = chunkZ + z;

 // +x
 if (face == "west") {
  amientOcculusionTemplate.push(
   OcculsionCalcuation(voxel, trueX, trueY, trueZ, 1, 0, -1) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, 1, 1, 0) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, 1, 1, -1),
   OcculsionCalcuation(voxel, trueX, trueY, trueZ, 1, 0, 1) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, 1, 1, 0) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, 1, 1, 1),

   OcculsionCalcuation(voxel, trueX, trueY, trueZ, 1, 0, 1) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, 1, -1, 0) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, 1, -1, 1),
   OcculsionCalcuation(voxel, trueX, trueY, trueZ, 1, 0, -1) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, 1, -1, 0) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, 1, -1, -1)
  );
 }

 // -x
 if (face == "east") {
  amientOcculusionTemplate.push(
   OcculsionCalcuation(voxel, trueX, trueY, trueZ, -1, 0, 1) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, -1, 1, 0) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, -1, 1, 1),

   OcculsionCalcuation(voxel, trueX, trueY, trueZ, -1, 0, -1) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, -1, 1, 0) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, -1, 1, -1),

   OcculsionCalcuation(voxel, trueX, trueY, trueZ, -1, 0, -1) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, -1, -1, 0) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, -1, -1, -1),

   OcculsionCalcuation(voxel, trueX, trueY, trueZ, -1, 0, 1) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, -1, -1, 0) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, -1, -1, 1)
  );
 }
 // +y
 if (face == "top") {
  amientOcculusionTemplate.push(
   OcculsionCalcuation(voxel, trueX, trueY, trueZ, 0, 1, -1) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, -1, 1, 0) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, -1, 1, -1),
   OcculsionCalcuation(voxel, trueX, trueY, trueZ, 0, 1, 1) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, -1, 1, 0) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, -1, 1, 1),
   OcculsionCalcuation(voxel, trueX, trueY, trueZ, 0, 1, 1) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, 1, 1, 0) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, 1, 1, 1),
   OcculsionCalcuation(voxel, trueX, trueY, trueZ, 0, 1, -1) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, 1, 1, 0) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, 1, 1, -1)
  );
 }

 // -y
 if (face == "bottom") {
  amientOcculusionTemplate.push(
   OcculsionCalcuation(voxel, trueX, trueY, trueZ, 0, -1, -1) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, -1, -1, 0) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, -1, -1, -1),
   OcculsionCalcuation(voxel, trueX, trueY, trueZ, 0, -1, -1) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, 1, -1, 0) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, 1, -1, -1),
   OcculsionCalcuation(voxel, trueX, trueY, trueZ, 0, -1, 1) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, 1, -1, 0) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, 1, -1, 1),
   OcculsionCalcuation(voxel, trueX, trueY, trueZ, 0, -1, 1) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, -1, -1, 0) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, -1, -1, 1)
  );
 }

 // +z
 if (face == "south") {
  amientOcculusionTemplate.push(
   OcculsionCalcuation(voxel, trueX, trueY, trueZ, 1, 0, 1) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, 0, 1, 1) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, 1, 1, 1),
   OcculsionCalcuation(voxel, trueX, trueY, trueZ, -1, 0, 1) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, 0, 1, 1) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, -1, 1, 1),
   OcculsionCalcuation(voxel, trueX, trueY, trueZ, -1, 0, 1) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, 0, -1, 1) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, -1, -1, 1),
   OcculsionCalcuation(voxel, trueX, trueY, trueZ, 1, 0, 1) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, 0, -1, 1) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, 1, -1, 1)
  );
 }

 // -z
 if (face == "north") {
  amientOcculusionTemplate.push(
   OcculsionCalcuation(voxel, trueX, trueY, trueZ, -1, 0, -1) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, 0, 1, -1) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, -1, 1, -1),
   OcculsionCalcuation(voxel, trueX, trueY, trueZ, 1, 0, -1) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, 0, 1, -1) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, 1, 1, -1),
   OcculsionCalcuation(voxel, trueX, trueY, trueZ, 1, 0, -1) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, 0, -1, -1) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, 1, -1, -1),
   OcculsionCalcuation(voxel, trueX, trueY, trueZ, -1, 0, -1) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, 0, -1, -1) *
    OcculsionCalcuation(voxel, trueX, trueY, trueZ, -1, -1, -1)
  );
 }
}
