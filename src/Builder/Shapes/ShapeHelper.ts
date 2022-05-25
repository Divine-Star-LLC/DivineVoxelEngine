//types
import type { DirectionNames } from "Meta/Util.types.js";
import type { VoxelShapeAddData, VoxelShapeAddReturnData } from "Meta/index";
//objects
import { Util } from "../../Global/Util.helper.js";
/**# Shape Helper
 * ---
 * A class that holds needed function shared betweeen different voxel shapes.
 */
export const ShapeHelper = {
 infoByte: Util.getInfoByte(),
 lightByte: Util.getLightByte(),
 //Use for producing the light gradient
 lightMap: [
  0.06, 0.1, 0.11, 0.14, 0.17, 0.21, 0.26, 0.31, 0.38, 0.45, 0.54, 0.64, 0.74,
  0.85, 0.97, 1,
 ],

 exposedFaceRecord: <Record<DirectionNames, number>>{
  top: 0,
  bottom: 1,
  west: 2,
  east: 3,
  north: 4,
  south: 5,
 },

 isFaceExposexd(
  voxelExposedFaceEncodedBit: number,
  faceDirection: DirectionNames
 ) {
  this.infoByte.setNumberValue(voxelExposedFaceEncodedBit);
  return this.infoByte.getBit(this.exposedFaceRecord[faceDirection]) == 1;
 },

 produceShapeReturnData(shapeData: VoxelShapeAddData) : VoxelShapeAddReturnData {
  return {
   newIndicieIndex: shapeData.indicieIndex,
   newFaceStateIndex : shapeData.faceStateIndex,
   newUVTemplateIndex: shapeData.uvTemplateIndex,
   newColorIndex: shapeData.colorIndex,
   newlightIndex: shapeData.lightIndex,
   newAOIndex: shapeData.aoIndex,
  };
 },

 toLinearSpace(r: number, g: number, b: number, a: number) {
  r = r ** 2.2;
  g = g ** 2.2;
  b = b ** 2.2;
  a = a * 1;
  return [r, g, b, a];
 },

 calculateLightColor(
  RGBlightColors: number[],
  sunlightColors: number[],
  lightTemplate: number[],
  startIndex: number
 ) {
  for (let v = 0; v < 4; v++) {
   const values = this.lightByte.getLightValues(lightTemplate[startIndex + v]);
   const w = this.lightMap[values[0]];
   const r = this.lightMap[values[1]];
   const g = this.lightMap[values[2]];
   const b = this.lightMap[values[3]];
   sunlightColors.push(w, w, w, 1);
   RGBlightColors.push(r, g, b, 1);
  }
 },

 calculateSunightColor(
  sunLight: number[],
  sunLightTemplate: number[],
  sunLightIndex: number
 ) {
  for (let v = 0; v < 4; v++) {
   const values = this.lightByte.getLightValues(
    sunLightTemplate[sunLightIndex + v]
   );
   const w = this.lightMap[values[0]];
   sunLight.push(w, w, w, 1);
  }
 },

 calculateAOColor(
  colors: number[],
  chunkAmbientOcculusion: number[],
  startIndex: number
 ) {
  for (let v = 0; v < 4; v++) {
   const aColor = chunkAmbientOcculusion[startIndex + v];
   const newColor = this.toLinearSpace(aColor, aColor, aColor, aColor);
   colors.push(newColor[0], newColor[1], newColor[2], 1);
  }
 },
};
