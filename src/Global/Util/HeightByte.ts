import { VoxelTemplateSubstanceType } from "Meta/index";
import { Flat3DArray } from "./Flat3DArray.js";
/**# Height Byte
 * ---
 * Interpets height map data.
 */
export const HeightByte = {
 _3dFlatArray: Flat3DArray,
 _getHeightMapData: <
  Record<VoxelTemplateSubstanceType, (byteData: number) => number>
 >{
  solid: (byteData) => {
   return (byteData & 0x7f) >>> 0;
  },
  fluid: (byteData) => {
   return (byteData & 0x7f00) >>> 8;
  },
  flora: (byteData) => {
   return (byteData & 0x7f0000) >>> 16;
  },
  magma: (byteData) => {
   return (byteData & 0x7f000000) >>> 24;
  },
 },

 _setHeightMapData: <
  Record<
   VoxelTemplateSubstanceType,
   (height: number, byteData: number) => number
  >
 >{
  solid: (height, byteData) => {
   byteData = byteData & ~(0x7f << 0);
   return byteData | (height << 0);
  },
  fluid: (height, byteData) => {
   byteData = byteData & ~0x7f00;
   return byteData | (height << 8);
  },
  flora: (height, byteData) => {
   byteData = byteData & ~0x7f0000;
   return byteData | (height << 16);
  },
  magma: (height, byteData) => {
   byteData = byteData & ~0x7f000000;
   return byteData | (height << 24);
  },
 },

 _markSubstanceAsNotExposed: <
  Record<VoxelTemplateSubstanceType, (data: number) => number>
 >{
  solid: (data) => {
   return data | (1 << 7);
  },
  fluid: (data) => {
   return data | (1 << 15);
  },
  flora: (data) => {
   return data | (1 << 23);
  },
  magma: (data) => {
   return data | (1 << 31);
  },
 },

 _markSubstanceAsExposed: <
  Record<VoxelTemplateSubstanceType, (data: number) => number>
 >{
  solid: (data) => {
   return data & ~(1 << 7);
  },
  fluid: (data) => {
   return data & ~(1 << 15);
  },
  flora: (data) => {
   return data & ~(1 << 23);
  },
  magma: (data) => {
   return data & ~(1 << 31);
  },
 },

 _isSubstanceExposed: <
  Record<VoxelTemplateSubstanceType, (data: number) => boolean>
 >{
  solid: (data) => {
   return (data & 0x80) >>> 7 != 1;
  },
  fluid: (data) => {
   return (data & 0x8000) >>> 15 != 1;
  },
  flora: (data) => {
   return (data & 0x800000) >>> 23 != 1;
  },
  magma: (data) => {
   return (data & 0x80000000) >>> 31 != 1;
  },
 },

 getStartingHeightMapValue() {
  //this number will mark all substances as not exposed and/or non existent in the chunk.
  return 0x80808080;
 },

 setNewHeightDataForSubstance(
  height: number,
  substance: VoxelTemplateSubstanceType,
  x: number,
  z: number,
  heightMap: Uint32Array
 ) {
  let minY = this.getMinYForSubstance(substance, x, z, heightMap);
  let maxY = this.getMaxYForSubstance(substance, x, z, heightMap);
  if (minY == height || maxY == height) return;
  if (height < minY) {
   this.setMinYForSubstance(height, substance, x, z, heightMap);
   return;
  }
  if (height > maxY) {
   this.setMaxYForSubstance(height, substance, x, z, heightMap);
   return;
  }
 },

 getLowestExposedVoxel(x: number, z: number, heightMap: Uint32Array) {
  const value = this._3dFlatArray.getValue(x, 0, z, heightMap);
  let min = this._getHeightMapData["solid"](value);
  let min2 = this._getHeightMapData["fluid"](value);
  if (min2 < min) {
   min = min2;
  }
  let min3 = this._getHeightMapData["flora"](value);
  if (min3 < min) {
   min = min3;
  }
  let min4 = this._getHeightMapData["magma"](value);
  if (min3 < min) {
   min = min4;
  }
  return min;
 },
 getHighestExposedVoxel(x: number, z: number, heightMap: Uint32Array) {
  const value = this._3dFlatArray.getValue(x, 1, z, heightMap);
  let max = this._getHeightMapData["solid"](value);
  let max2 = this._getHeightMapData["fluid"](value);
  if (max2 > max) {
   max = max2;
  }
  let max3 = this._getHeightMapData["flora"](value);
  if (max3 > max) {
   max = max3;
  }
  let max4 = this._getHeightMapData["magma"](value);
  if (max3 > max) {
   max = max4;
  }
  return max;
 },

 isSubstanceExposed(
  substance: VoxelTemplateSubstanceType,
  x: number,
  z: number,
  heightMap: Uint32Array
 ) {
  let value = this._3dFlatArray.getValue(x, 0, z, heightMap);
  return this._isSubstanceExposed[substance](value);
 },

 markSubstanceAsExposed(
  substance: VoxelTemplateSubstanceType,
  x: number,
  z: number,
  heightMap: Uint32Array
 ) {
  let value = this._3dFlatArray.getValue(x, 0, z, heightMap);
  value = this._markSubstanceAsExposed[substance](value);
  this._3dFlatArray.setValue(x, 0, z, heightMap, value);
 },

 markSubstanceAsNotExposed(
  substance: VoxelTemplateSubstanceType,
  x: number,
  z: number,
  heightMap: Uint32Array
 ) {
  let value = this._3dFlatArray.getValue(x, 0, z, heightMap);
  value = this._markSubstanceAsNotExposed[substance](value);
  this._3dFlatArray.setValue(x, 0, z, heightMap, value);
 },

 setMinYForSubstance(
  height: number,
  substance: VoxelTemplateSubstanceType,
  x: number,
  z: number,
  heightMap: Uint32Array
 ) {
  let byteData = this._3dFlatArray.getValue(x, 0, z, heightMap);
  byteData = this._setHeightMapData[substance](height, byteData);
  this._3dFlatArray.setValue(x, 0, z, heightMap, byteData);
 },
 getMinYForSubstance(
  substance: VoxelTemplateSubstanceType,
  x: number,
  z: number,
  heightMap: Uint32Array
 ) {
  let byteData = this._3dFlatArray.getValue(x, 0, z, heightMap);
  return this._getHeightMapData[substance](byteData);
 },
 setMaxYForSubstance(
  height: number,
  substance: VoxelTemplateSubstanceType,
  x: number,
  z: number,
  heightMap: Uint32Array
 ) {
  let byteData = this._3dFlatArray.getValue(x, 1, z, heightMap);
  byteData = this._setHeightMapData[substance](height, byteData);
  this._3dFlatArray.setValue(x, 1, z, heightMap, byteData);
 },
 getMaxYForSubstance(
  substance: VoxelTemplateSubstanceType,
  x: number,
  z: number,
  heightMap: Uint32Array
 ) {
  let byteData = this._3dFlatArray.getValue(x, 1, z, heightMap);
  return this._getHeightMapData[substance](byteData);
 },
};
