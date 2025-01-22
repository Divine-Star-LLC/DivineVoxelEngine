import { PaintVoxelData } from "../Data/Types/WorldData.types";
import { VoxelData, RawVoxelData, VoxelNamedStateData } from "../VoxelData/Voxel.types";
import { SchemaRegister } from "../VoxelState/SchemaRegister";
import { VoxelPalette } from "../Data/Palettes/VoxelPalette";
export class VoxelNamedState {
  tags = new Map<string, any>();

  compiled = {
    mod: 0,
    modAny: false,
    shapeState: 0,
    shapeStateAny: false,
  };
  constructor(
    public voxelId: string,
    public data: VoxelNamedStateData
  ) {
    for (const key in data.properties) {
      this.tags.set(key, data.properties[key]);
    }
    if (SchemaRegister.voxelModSchemaData.has(this.voxelId)) {
      const schema = SchemaRegister.getVoxelSchemas(this.voxelId);
      if (this.data.state == "*") {
        this.compiled.shapeStateAny = true;
      } else if (this.data.state) {
        this.compiled.shapeState = schema.shapeState.readString(
          this.data.state
        );
      }

      if (this.data.mod == "*") {
        this.compiled.modAny = true;
      } else if (this.data.mod) {
        this.compiled.mod = schema.modState.readString(this.data.mod);
      }
    } else {
      this.compiled.modAny = true;
      this.compiled.shapeStateAny = true;
    }
  }

  getPaintData(): PaintVoxelData {
    const schema = SchemaRegister.getVoxelSchemas(this.voxelId);
    return PaintVoxelData.Create({
      id: this.voxelId,
      level: 0,
      levelState: 0,
      shapeState: this.compiled.shapeState,
      mod: this.compiled.mod,
    });
  }
}

export class VoxelNamedStateContainer {
  states = new Map<string, VoxelNamedState>();

  stateArray: VoxelNamedState[] = [];
  constructor(
    public voxelId: string,
    data: VoxelNamedState[]
  ) {
    for (const state of data) {
      this.states.set(state.data.id, state);
      this.stateArray.push(state);
    }
  }
}

class TagIndex {
  states = new Map<string, VoxelNamedState>();
  //maps named state to the value of the tag
  valueMap = new Map<string, any>();
  values = new Set<any>();

  constructor(public tagId: string) {}
}

export class VoxelIndex {
  static instance: VoxelIndex;
  dataMap = new Map<string, VoxelData>();
  states = new Map<string, VoxelNamedStateContainer>();
  stateArray: VoxelNamedStateContainer[] = [];
  tagIndexes = new Map<string, TagIndex>();
  constructor(data: VoxelData[]) {
    if (VoxelIndex.instance) return VoxelIndex.instance;
    if (!VoxelIndex.instance) VoxelIndex.instance = this;

    for (const voxelData of data) {
      const namedStates = voxelData.properties["dve_named_states"];
      if (!namedStates) continue;
      const states = new VoxelNamedStateContainer(
        voxelData.id,
        namedStates.map((_) => new VoxelNamedState(voxelData.id, _))
      );
      this.dataMap.set(voxelData.id, voxelData);
      this.stateArray.push(states);
      this.states.set(voxelData.id, states);
      for (const [id, state] of states.states) {
        for (const tagId in state.data.properties) {
          const tagData = state.data.properties[tagId];
          let tag = this.tagIndexes.get(tagId);
          if (!tag) {
            tag = new TagIndex(tagId);
            this.tagIndexes.set(tagId, tag);
          }
          tag.states.set(state.data.id, state);
          tag.states.set(state.data.id, tagData);
          tag.values.add(tagData);
        }
      }
    }
  }

  getStateFromPaintData(data: PaintVoxelData): VoxelNamedState | false {
    const conatiner = this.states.get(data.id);
    if (!conatiner) return false;
    const { mod, shapeState } = data;
    for (const state of conatiner?.stateArray) {
      if (
        (mod == state.compiled.mod || state.compiled.modAny) &&
        (shapeState == state.compiled.shapeState ||
          state.compiled.shapeStateAny)
      )
        return state;
    }
    return false;
  }
  getStateFromRawData(data: RawVoxelData): VoxelNamedState | false {
    const [id, light, shapeState, secondary, mod] = data;
    const conatiner = this.states.get(VoxelPalette.ids.getStringId(id));
    if (!conatiner) return false;
    for (const state of conatiner?.stateArray) {
      if (
        (mod == state.compiled.mod || state.compiled.modAny) &&
        (shapeState == state.compiled.shapeState ||
          state.compiled.shapeStateAny)
      )
        return state;
    }
    return false;
  }
}
