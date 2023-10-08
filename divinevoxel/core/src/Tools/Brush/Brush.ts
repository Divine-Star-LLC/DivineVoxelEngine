import type { AddVoxelData } from "Types/Data/WorldData.types";
import { DataTool } from "../../Tools/Data/DataTool.js";
import type { RawVoxelData } from "Types/Data/Voxels/Voxel.types.js";
import { DimensionsRegister } from "../../Data/World/Dimensions/DimensionsRegister.js";
import { WorldPainter } from "../../Data/World/WorldPainter.js";
import { WorldRegister } from "../../Data/World/WorldRegister.js";
import { VoxelPaletteReader } from "../../Data/Voxel/VoxelPalette.js";
import { LocationBoundTool } from "../Classes/LocationBoundTool.js";
export class BrushTool extends LocationBoundTool {
 data: AddVoxelData = {
  id: "dve_air",
  state: 0,
  shapeState: 0,
  secondaryState: 0,
  secondaryVoxelId: "dve_air",
  level: 0,
  levelState: 0,
 };

 _update = true;

 _dt = new DataTool();

 setData(data: Partial<AddVoxelData>) {
  for (const key in data) {
   if (typeof (data as any)[key] !== undefined) {
    (this as any).data[key] = (data as any)[key];
   }
  }
  return this;
 }

 setId(id: string, state = 0, shapeState = 0) {
  this.data.id = id;
  this.data.state = state;
  this.data.shapeState = shapeState;
  return this;
 }

 setDimension(dimensionId: string) {
  this.location[0] = dimensionId;
  this._dt.setDimension(dimensionId);
  return this;
 }

 setSecondaryId(id: string, state = 0) {
  this.data.secondaryVoxelId = id;
  this.data.secondaryState = state;
  return this;
 }

 setState(state: number) {
  this.data.state = state;
  return this;
 }

 setShapeState(state: number) {
  this.data.shapeState = state;
  return this;
 }

 setLevel(level: number) {
  this.data.level = level;
  return this;
 }

 setLevelState(levelState: number) {
  this.data.levelState = levelState;
  return this;
 }
 clear() {
  this.data.id = "dve_air";
  this.data.secondaryVoxelId = "dve_air";
  this.data.level = 0;
  this.data.levelState = 0;
  this.data.state = 0;
  this.data.secondaryState = 0;
  this.data.shapeState = 0;
  this.location[1] = 0;
  this.location[2] = 0;
  this.location[3] = 0;
 }

 setRaw(data: RawVoxelData) {
  this._dt.loadInRaw(data);
  this.data.id = this._dt.getStringId();
  this.data.shapeState = this._dt.getShapeState();
  this.data.state = this._dt.getState();
  this._dt.setSecondary(true);
  if (this._dt.data.secondaryId >= 2) {
   this.data.secondaryVoxelId = this._dt.getStringId();
   this.data.secondaryState = this._dt.getState();
  }
  this._dt.setSecondary(false);
  return this;
 }

 getRaw() {
  this._dt.setId(
   VoxelPaletteReader.id.getPaletteId(this.data.id, this.data.state)
  );
  this._dt
   .setSecondary(true)
   .setId(
    VoxelPaletteReader.id.getPaletteId(
     this.data.secondaryVoxelId,
     this.data.secondaryState
    )
   )
   .setSecondary(false);

  this._dt.setLevel(this.data.level);
  this._dt.setLevelState(this.data.levelState);
  this._dt.setShapeState(this.data.shapeState);
  this._dt.data.raw[3] == -1 ? (this._dt.data.raw[3] = 0) : false;
  return this._dt.data.raw;
 }

 getData() {
  return this.data;
 }

 paint() {
  WorldPainter.paint.voxel(this.location, this.data, this._update);
  return this;
 }

 erase() {
  WorldPainter.paint.erase(this.location);
  return this;
 }

 start() {
  WorldRegister.cache.enable();
  return this;
 }

 stop() {
  WorldRegister.cache.disable();
  return this;
 }
}
