import { DataCursorInterface } from "../../Tools/DataCursor.interface";
import { VoxelModelConstructorRegister } from "./VoxelModelConstructorRegister";
import { Vec3Array, Vector3Like } from "@amodx/math";
import { VoxelCursor } from "../../Voxels/Cursor/VoxelCursor";
import { GetYXZOrderArrayIndex } from "../../Math/Indexing";

export class VoxelGeometryBuilderCacheSpace {
  foundHash: Uint8Array;
  voxelCache: Uint16Array;
  lightCache: Int32Array;
  modCache: Int32Array;
  stateCache: Int32Array;
  conditonalStateCache: Int32Array;
  noCastAO: Uint8Array;
  offset: Vec3Array = [0, 0, 0];
  voxelCursor = new VoxelCursor();

  constructor(public bounds: Vector3Like) {
    const volume = bounds.x * bounds.y * bounds.z;
    this.foundHash = new Uint8Array(volume);
    this.lightCache = new Int32Array(volume);
    this.voxelCache = new Uint16Array(volume);
    this.modCache = new Int32Array(volume);
    this.stateCache = new Int32Array(volume);
    this.conditonalStateCache = new Int32Array(volume);
    this.noCastAO = new Uint8Array(volume);
  }
  start(x: number, y: number, z: number) {
    this.offset[0] = x;
    this.offset[1] = y;
    this.offset[2] = z;
    this.lightCache.fill(-1);
    this.foundHash.fill(0);
    this.voxelCache.fill(0);
    this.modCache.fill(-1);
    this.stateCache.fill(-1);
    this.conditonalStateCache.fill(-1);
    this.noCastAO.fill(0);
  }

  getIndex(x: number, y: number, z: number) {
    return GetYXZOrderArrayIndex(
      x - this.offset[0],
      y - this.offset[1],
      z - this.offset[2],
      this.bounds.x,
      this.bounds.y,
      this.bounds.z
    );
  }

  getConstructor(index: number) {
    if (this.foundHash[index] < 2) return null;
    return VoxelModelConstructorRegister.constructorsPaltte[
      this.voxelCache[index]
    ];
  }
  getGeomtry(index: number) {
    if (this.foundHash[index] < 2) return false;
    return VoxelModelConstructorRegister.constructorsPaltte[
      this.voxelCache[index]
    ].data.shapeStateGeometryMap[this.stateCache[index]];
  }
  getConditionalGeomtry(index: number) {
    if (this.foundHash[index] < 2) return false;
    return VoxelModelConstructorRegister.constructorsPaltte[
      this.voxelCache[index]
    ].data.condiotnalShapeStateGeometryMap[this.conditonalStateCache[index]];
  }

  getHash(dataCursor: DataCursorInterface, x: number, y: number, z: number) {
    const hashed = this.getIndex(x, y, z);
    if (this.foundHash[hashed] == 0) {
      this.hashState(dataCursor, hashed, x, y, z);
    }
    return hashed;
  }
  getLight(dataCursor: DataCursorInterface, x: number, y: number, z: number) {
    const index = this.getIndex(x, y, z);
    if (this.lightCache[index] == -1) {
      this.lightCache[index] = 0;
      const voxel = dataCursor.getVoxel(x, y, z);
      if (voxel) {
        const light = voxel.getLight();
        if (light > 0) {
          this.lightCache[index] = light;
        }
      }
    }
    return this.lightCache[index];
  }

  private hashState(
    dataCursor: DataCursorInterface,
    index: number,
    x: number,
    y: number,
    z: number
  ) {
    if (this.foundHash[index] == 1) return -1;
    if (this.foundHash[index] == 2) return this.stateCache[index];

    const voxel = dataCursor.getVoxel(x, y, z);
    if (voxel) {
      const light = voxel.getLight();
      if (light > 0) {
        this.lightCache[index] = light;
      }
    }

    if (!voxel || !voxel.isRenderable()) {
      this.foundHash[index] = 1;
      return -1;
    }

    const voxelId = voxel.getId();
    const voxelConstructor =
      VoxelModelConstructorRegister.constructorsPaltte[voxelId];
    if (!voxelConstructor) {
      this.foundHash[index] = 1;
      return -1;
    }

    this.voxelCache[index] = voxelId;

    this.foundHash[index] = 2;

    //no ao
    this.noCastAO[index] = voxel.isLightSource() || voxel.noAO() ? 1 : 0;
    //state
    const state = voxelConstructor.shapeStateTree.getState(voxel.getState());
    this.stateCache[index] = state;
    //mod
    const mod = voxelConstructor.modTree.getState(voxel.getMod());
    this.modCache[index] = mod;
    this.voxelCursor.copy(voxel).process();
    voxelConstructor.schema.position.x = x;
    voxelConstructor.schema.position.y = y;
    voxelConstructor.schema.position.z = z;
    voxelConstructor.schema.voxel = this.voxelCursor;
    voxelConstructor.schema.dataCursor = dataCursor;

    const conditonalState =
      voxelConstructor.condtioanlShapeStateTree.getState();

    this.conditonalStateCache[index] = conditonalState;

    return 1;
  }
}
