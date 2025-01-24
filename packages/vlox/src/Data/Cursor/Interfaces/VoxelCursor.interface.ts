import { VoxelStructIds } from "../../../Voxels/Voxel.types";
import { LightData } from "../../../Voxels/LightData";
import { MappedDataRegister } from "../../Register/MappedDataRegister";
import { VoxelStruct } from "../../Structs/VoxelStruct";
import { VoxelStateReader } from "../../../Voxels/VoxelStateReader";
import { VoxelTagStates } from "../../../Voxels/State/VoxelTagStates";
import { VoxelPalette } from "../../Palettes/VoxelPalette";
import { DataTool } from "../../../Tools/Data/DataTool";
import { SubstancePalette } from "../../Palettes/SubstancePalette";
import { RawVoxelData } from "../../../Voxels/Voxel.types";
import { MaterialPalette } from "../../../Data/Palettes/MaterialPalette";
interface WritableArrayLike<T> {
  length: number;
  [index: number]: T;
}
export abstract class VoxelCursorInterface {
  _loadedId = 0;
  id = 0;
  secondaryId = 0;

  __struct: VoxelStruct;
  __secondary = false;

  // private _chunk: Chunk;
  _index = 0;

  abstract ids: WritableArrayLike<number>;
  abstract light: WritableArrayLike<number>;
  abstract state: WritableArrayLike<number>;
  abstract secondary: WritableArrayLike<number>;
  abstract mod: WritableArrayLike<number>;

  process() {
    if (!this.__struct) this.__struct = VoxelStruct.clone();
    this.id = this.ids[this._index];
    this.secondaryId = this.secondary[this._index];

    if (this.secondaryId > 1) {
      this.id = this.secondaryId;
    } else {
      this.secondaryId = 0;
    }
    this.__struct.setIndex(VoxelStruct.voxelIndex[this.id]);
    this._loadedId = this.getId();
  }

  abstract loadIn(): void;

  setSecondary(enable: boolean) {
    this.__secondary = enable;
    if (enable) {
      this.__struct.setIndex(VoxelStruct.voxelIndex[this.secondaryId]);
    } else {
      this.__struct.setIndex(VoxelStruct.voxelIndex[this.id]);
    }
    this._loadedId = this.getId();
    return this;
  }
  getRenderedMaterial() {
    return this.__struct[VoxelStructIds.renderedMaterial];
  }
  getRenderedMaterialStringId() {
    return MaterialPalette.id.stringFromNumber(
      this.__struct[VoxelStructIds.renderedMaterial]
    );
  }
  getMaterial() {
    return this.__struct[VoxelStructIds.voxelMaterial];
  }
  getMaterialStringId() {
    return MaterialPalette.id.stringFromNumber(
      this.__struct[VoxelStructIds.voxelMaterial]
    );
  }
  getSubstance() {
    return this.__struct[VoxelStructIds.substance];
  }
  getSubstanceStringId() {
    return SubstancePalette.id.stringFromNumber(this.getSubstance());
  }
  isOpaque() {
    return this.__struct[VoxelStructIds.isTransparent] == 0;
  }
  getMod() {
    return this.mod[this._index];
  }
  setMod(mod: number) {
    this.mod[this._index] = mod;
    return this;
  }
  getLevel() {
    return VoxelStateReader.getLevel(this.state[this._index]);
  }
  setLevel(level: number) {
    this.state[this._index] = VoxelStateReader.setLevel(
      this.state[this._index],
      level
    );
    return this;
  }
  getLevelState() {
    return VoxelStateReader.getLevelState(this.state[this._index]);
  }
  setLevelState(state: number) {
    this.state[this._index] = VoxelStateReader.setLevelState(
      this.state[this._index],
      state
    );
    return this;
  }
  getShapeState() {
    return VoxelStateReader.getShapeState(this.state[this._index]);
  }
  setShapeState(state: number) {
    this.state[this._index] = VoxelStateReader.setShapeState(
      this.state[this._index],
      state
    );
    return this;
  }
  hasSecondaryVoxel() {
    return this.secondaryId > 1;
  }
  canHaveSecondaryVoxel() {
    return this.__struct[VoxelStructIds.canHaveSecondary] == 1;
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
    const vID = this._loadedId;
    if (vID == 0) return this.light[this._index];
    if (vID < 2) return -1;

    const lightValue = this.__struct[VoxelStructIds.lightValue];
    if (this.isOpaque()) {
      if (this.isLightSource() && lightValue) {
        return lightValue;
      } else {
        return -1;
      }
    }
    if (this.isLightSource() && lightValue) {
      return LightData.mixLight(this.light[this._index], lightValue);
    }
    return this.light[this._index];
  }
  setLight(light: number) {
    this.light[this._index] = light;
    return this;
  }

  isLightSource() {
    const vID = this._loadedId;
    if (vID < 2) return false;
    return VoxelTagStates.isRegistered(
      this._loadedId,
      VoxelStructIds.isLightSource
    )
      ? VoxelTagStates.getValue(
          this._loadedId,
          VoxelStructIds.isLightSource,
          this.getShapeState()
        ) === true
      : this.__struct[VoxelStructIds.isLightSource] == 1;
  }
  getLightSourceValue() {
    const vID = this._loadedId;
    if (vID < 2) return 0;
    return this.__struct[VoxelStructIds.lightValue];
  }
  noAO() {
    const vID = this._loadedId;
    if (vID < 2) return false;
    return this.__struct[VoxelStructIds.noAO] == 1;
  }
  isRenderable() {
    if (this.id < 2 && this.secondaryId < 2) return false;
    return true;
  }
  isAir() {
    return 0 == this.ids[this._index];
  }
  setAir() {
    this.ids[0] = 0;
    return this;
  }
  isBarrier() {
    return 1 == this.ids[this._index];
  }
  getId() {
    if (this.__secondary) {
      return this.secondaryId;
    }
    return this.id;
  }
  setId(id: number) {
    if (this.__secondary) {
      this.secondary[this._index] = id;
      return this;
    }
    this.ids[this._index] = id;
    return this;
  }
  setStringId(id: string) {
    return this.setId(VoxelPalette.ids.getNumberId(id)!);
  }
  getStringId() {
    if (this.__secondary) {
      return VoxelPalette.ids.getStringId(this.secondaryId);
    }
    return VoxelPalette.ids.getStringId(this.id);
  }

  setName(name: string) {
    this.setStringId(VoxelPalette.name.getId(name));
  }

  getName() {
    return this.getStringId();
  }

  isSameVoxel(voxel: VoxelCursorInterface | DataTool) {
    return this.getId() == voxel.getId();
  }
  copy(cursor: VoxelCursorInterface) {
    this.ids[this._index] = cursor.ids[cursor._index];
    this.light[this._index] = cursor.light[cursor._index];
    this.state[this._index] = cursor.state[cursor._index];
    this.secondary[this._index] = cursor.secondary[cursor._index];
    this.mod[this._index] = cursor.mod[cursor._index];
    return this;
  }

  copyRaw(raw: RawVoxelData) {
    this.ids[this._index] = raw[0];
    this.light[this._index] = raw[1];
    this.state[this._index] = raw[2];
    this.secondary[this._index] = raw[3];
    this.mod[this._index] = raw[4];
    return this;
  }

  getRaw(): RawVoxelData {
    return [
      this.ids[this._index],
      this.light[this._index],
      this.state[this._index],
      this.secondary[this._index],
      this.mod[this._index],
    ];
  }

  getRawToRef(raw: RawVoxelData): RawVoxelData {
    raw[0] = this.ids[this._index];
    raw[1] = this.light[this._index];
    raw[2] = this.state[this._index];
    raw[3] = this.secondary[this._index];
    raw[4] = this.mod[this._index];
    return raw;
  }
}
