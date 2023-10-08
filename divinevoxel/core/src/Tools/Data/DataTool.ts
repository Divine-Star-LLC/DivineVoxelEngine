import type {
 RawVoxelData,
 VoxelSubstanceType,
 VoxelTemplateSubstanceType,
} from "Types/Data/Voxels/Voxel.types.js";
import { DimensionsRegister } from "../../Data/World/Dimensions/DimensionsRegister.js";
import { VoxelReader } from "../../Data/Voxel/VoxelReader.js";
import { VoxelTags } from "../../Data/Voxel/VoxelTags.js";
import { VoxelPaletteReader } from "../../Data/Voxel/VoxelPalette.js";
import { ChunkDataTool } from "./WorldData/ChunkDataTool.js";
import { HeightMapTool } from "./WorldData/HeightMapTool.js";
import { DataToolBase } from "../Classes/DataToolBase.js";
import { WorldSpaces } from "../../Data/World/WorldSpaces.js";
import { ColumnDataTool } from "./WorldData/ColumnDataTool.js";
import { LightData } from "../../Data/Light/LightByte.js";
import { VoxelTagIDs } from "../../Data/Constants/Tags/VoxelTagIds.js";
import { MappedDataRegister } from "../../Data/Register/MappedDataRegister.js";
import { SubstanceDataTool } from "./SubstanceDataTool.js";

export class DataTool extends DataToolBase {
 /**# World Data Mode
  * ---
  * Read data directly from the world.
  */
 static WORLD_DATA_MODE = 0;
 /**# Voxel Matrix Mode
  * ---
  * Read from a voxel matrix.
  */
 static VOXEL_MATRIX_MODE = 1;
 /**# Voxel Data Mode
  * ---
  * Read data from a single voxel passed in via `loadInRaw`
  */
 static VOXEL_DATA_MODE = 2;

 static _dtutil = new DataTool();
 _chunkTool = new ChunkDataTool();
 _substanceTool = new SubstanceDataTool();
 static _heightMapTool = new HeightMapTool();
 static _columntool = new ColumnDataTool();
 _locationKey = "";
 _loadedIn = false;
 _mode = 0;
 data = {
  raw: <RawVoxelData>[0, 0, 0, 0],
  id: 0,
  baseId: 0,
  secondaryId: 0,
  secondaryBaseId: 0,
 };
 __secondary = false;

 tags = VoxelTags;

 setMode(
  mode:
   | typeof DataTool.VOXEL_DATA_MODE
   | typeof DataTool.VOXEL_MATRIX_MODE
   | typeof DataTool.WORLD_DATA_MODE
 ) {
  this._mode = mode;
  return this;
 }

 clear() {
  this._loadedIn = false;
  this._locationKey = "";
  let i = this.data.raw.length;
  while (i--) {
   this.data.raw[i] = 0;
  }
  this.data.id = 0;
  this.data.baseId = 0;
  this.data.secondaryId = 0;
  this.data.secondaryBaseId = 0;
  return this;
 }

 setDimension(dimensionId: string | number) {
  this.location[0] = DimensionsRegister.getDimensionStringId(dimensionId);
  return this;
 }

 setSecondary(enable: boolean) {
  this.__secondary = enable;
  if (enable) {
   VoxelTags.setVoxel(this.data.secondaryBaseId);
  } else {
   VoxelTags.setVoxel(this.data.baseId);
  }
  return this;
 }
 _getBaseId(id: number) {
  return VoxelPaletteReader.id.baseNumeric(id);
 }

 getSubstnaceData() {
  this._substanceTool.setSubstance(this.getSubstance());
  return this._substanceTool;
 }

 getRaw() {
  return this.data.raw;
 }

 loadInRaw(rawData: RawVoxelData) {
  this.data.raw = rawData;
  this.__process();
  return this;
 }

 __process() {
  this.data.id = this.data.raw[0];
  this.data.secondaryId = this.data.raw[3];
  this.data.baseId = this._getBaseId(this.data.id);
  if (this.data.secondaryId > 1) {
   this.data.secondaryBaseId = this._getBaseId(this.data.secondaryId);
  } else {
   this.data.secondaryBaseId = 0;
  }
  VoxelTags.setVoxel(this.data.baseId);
 }

 loadIn() {
  this._c = this.tags.data;
  if (this._mode == DataTool.WORLD_DATA_MODE) {
   if (!this._chunkTool.setLocation(this.location).loadIn()) return false;

   const index = WorldSpaces.voxel.getIndexLocation(this.location);
   this.data.raw[0] = this._chunkTool.segments.id.get(index);
   this.data.raw[1] = this._chunkTool.segments.light.get(index);
   this.data.raw[2] = this._chunkTool.segments.state.get(index);
   this.data.raw[3] = this._chunkTool.segments.secondaryId.get(index);
   this.__process();
   this._loadedIn = true;
   return true;
  }
  if (this._mode == DataTool.VOXEL_MATRIX_MODE) {
   return false;
  }
  if (this._mode == DataTool.VOXEL_DATA_MODE) {
   this.data.raw[0] = 0;
   this.data.raw[1] = LightData.getS(0xff);
   this.data.raw[2] = 0;
   return false;
  }

  return false;
 }

 commit(heightMapUpdate = 0) {
  if (!this._loadedIn) return false;
  if (this._mode == DataTool.WORLD_DATA_MODE) {
   const index = WorldSpaces.voxel.getIndexLocation(this.location);

   this._chunkTool.segments.id.set(index, this.data.raw[0]);
   this._chunkTool.segments.light.set(index, this.data.raw[1]);
   this._chunkTool.segments.state.set(index, this.data.raw[2]);
   this._chunkTool.segments.secondaryId.set(index, this.data.raw[3]);
   if (DataTool._columntool.loadInAtLocation(this.location)) {
    DataTool._columntool.markAsNotStored();
   }
   if (heightMapUpdate) {
    DataTool._heightMapTool.chunk._c = <DataView>this._chunkTool._c;
    const substance = this.getTemplateSubstance();
    //on add
    if (heightMapUpdate == 1) {
     DataTool._heightMapTool.chunk.setY(this.y).setHasVoxels(true);
     //  DataTool._heightMapTool.chunk.update("add", substance, this.location);
    }
    //on remove
    if (heightMapUpdate == 2) {
     DataTool._heightMapTool.chunk.setY(this.y).setDirty(true);
     //   DataTool._heightMapTool.chunk.update("remove", substance, this.location);
    }
   }
   this._loadedIn = false;
   return true;
  }
  if (this._mode == DataTool.VOXEL_MATRIX_MODE) {
   return false;
  }
  if (this._mode == DataTool.VOXEL_DATA_MODE) {
   return false;
  }
  return false;
 }

 hasRGBLight() {
  const light = this.getLight();
  if (light <= 0) false;
  return LightData.hasRGBLight(light);
 }
 hasSunLight() {
  const light = this.getLight();
  if (light <= 0) false;
  return LightData.hasSunLight(light);
 }
 getLight() {
  if (this._mode == DataTool.VOXEL_DATA_MODE) return 0xf;
  const vID = this.getId(true);
  VoxelTags.setVoxel(vID);
  if (vID == 0) return this.data.raw[1];
  if (vID < 2) return -1;
  const lightValue = this.getTagValue(VoxelTagIDs.lightValue);
  if (this.isOpaque()) {
   if (this.getTagValue(VoxelTagIDs.isLightSource) && lightValue) {
    return lightValue;
   } else {
    return -1;
   }
  }
  if (this.getTagValue("#dve_is_light_source") && lightValue) {
   return LightData.mixLight(this.data.raw[1], lightValue);
  }
  return this.data.raw[1];
 }
 setLight(light: number) {
  this.data.raw[1] = light;
  return this;
 }

 isOpaque() {
  const substance = this.getSubstance();
  if (substance == "#dve_solid") return true;
 }

 getLevel() {
  return VoxelReader.getLevel(this.data.raw[2]);
 }
 setLevel(level: number) {
  this.data.raw[2] = VoxelReader.setLevel(this.data.raw[2], level);
  return this;
 }
 getLevelState() {
  return VoxelReader.getLevelState(this.data.raw[2]);
 }
 setLevelState(state: number) {
  this.data.raw[2] = VoxelReader.setLevelState(this.data.raw[2], state);
  return this;
 }
 getShapeState() {
  return VoxelReader.getShapeState(this.data.raw[2]);
 }
 setShapeState(state: number) {
  this.data.raw[2] = VoxelReader.setShapeState(this.data.raw[2], state);
  return this;
 }
 hasSecondaryVoxel() {
  return this.data.secondaryBaseId > 1;
 }

 //voxel data
 getShapeId() {
  const vID = this.getId(true);
  if (vID < 2) return "";
  VoxelTags.setVoxel(vID);
  return MappedDataRegister.stringMaps.get(
   "voxel",
   VoxelTagIDs.shapeID,
   VoxelTags.getTag(VoxelTagIDs.shapeID)
  );
 }
 isLightSource() {
  const vID = this.getId(true);
  if (vID < 2) return false;
  VoxelTags.setVoxel(vID);
  return VoxelTags.getTag(VoxelTagIDs.isLightSource) == 1;
 }
 getLightSourceValue() {
  const vID = this.getId(true);
  if (vID < 2) return 0;
  VoxelTags.setVoxel(vID);
  return VoxelTags.getTag(VoxelTagIDs.lightValue);
 }
 getSubstance() {
  const vID = this.getId(true);
  if (vID < 2) return "#dve_transparent";
  VoxelTags.setVoxel(vID);
  const s = <VoxelSubstanceType>(
   MappedDataRegister.stringMaps.get(
    "voxel",
    VoxelTagIDs.substance,
    VoxelTags.getTag(VoxelTagIDs.substance)
   )
  );
  return s;
 }
 getMaterial() {
  const vID = this.getId(true);
  if (vID < 2) return "none";
  VoxelTags.setVoxel(vID);
  return MappedDataRegister.stringMaps.get(
   "voxel",
   VoxelTagIDs.material,
   VoxelTags.getTag(VoxelTagIDs.material)
  );
 }
 getHardness() {
  const vID = this.getId(true);
  if (vID < 2) return 0;
  VoxelTags.setVoxel(vID);
  return VoxelTags.getTag(VoxelTagIDs.hardness);
 }
 getCollider() {
  const vID = this.getId(true);
  if (vID < 2) return "none";
  VoxelTags.setVoxel(vID);
  return MappedDataRegister.stringMaps.get(
   "voxel",
   VoxelTagIDs.colliderID,
   VoxelTags.getTag(VoxelTagIDs.colliderID)
  );
 }
 checkCollisions() {
  const vID = this.getId(true);
  if (vID == 0) return false;
  if (vID == 1) return true;
  VoxelTags.setVoxel(vID);
  return this.getTagValue(VoxelTagIDs.checkCollisions) == 1;
 }

 getTemplateSubstance(): VoxelTemplateSubstanceType {
  let substance = this.getSubstance();
  if (substance == "#dve_transparent") {
   substance = "#dve_solid";
  }
  return <VoxelTemplateSubstanceType>substance;
 }
 getState() {
  if (this.__secondary) {
   return this.data.secondaryId - this.data.secondaryBaseId;
  }
  return this.data.id - this.data.baseId;
 }
 isRich() {
  const vID = this.getId(true);
  if (vID < 2) return 0;
  VoxelTags.setVoxel(vID);
  return VoxelTags.getTag(VoxelTagIDs.isLightSource);
 }

 //util
 setAir() {
  this.data.raw[0] = 0;
  this.__process();
  return this;
 }
 isAir() {
  return 0 == this.data.raw[0];
 }
 setBarrier() {
  this.data.raw[0] = 1;
  this.__process();
  return this;
 }
 isBarrier() {
  return 1 == this.data.raw[0];
 }
 //voxel id
 getId(base: boolean = false) {
  if (this.__secondary) {
   if (!base) return this.data.secondaryId;
   return this.data.secondaryBaseId;
  }
  if (!base) return this.data.id;
  return this.data.baseId;
 }
 setId(id: number) {
  if (this.__secondary) {
   this.data.raw[3] = id;
   this.data.secondaryId = id;
   this.data.secondaryBaseId = this._getBaseId(id);
   return this;
  }
  this.data.raw[0] = id;
  this.data.id = id;
  this.data.baseId = this._getBaseId(id);
  return this;
 }
 setStringId(id: string) {
  return this.setId(VoxelPaletteReader.id.numberFromString(id)!);
 }
 getStringId() {
  if (this.__secondary) {
   return VoxelPaletteReader.id.stringFromNumber(this.data.secondaryBaseId);
  }
  return VoxelPaletteReader.id.stringFromNumber(this.data.baseId);
 }

 //util
 isRenderable() {
  if (this.data.id < 2 && this.data.secondaryId < 2) return false;
  return true;
 }
 isSameVoxel(cx: number, cy: number, cz: number) {
  DataTool._dtutil.loadInAt(cx, cy, cz);
  if (this.__secondary) {
   return this.data.secondaryBaseId == DataTool._dtutil.data.secondaryBaseId;
  }
  return this.data.baseId == DataTool._dtutil.data.baseId;
 }
}
