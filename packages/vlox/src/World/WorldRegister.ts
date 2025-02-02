import { WorldSpaces } from "./WorldSpaces.js";
import { Dimension } from "./Dimension/Dimension";
import { Sector, SectorData } from "./Sector/Sector.js";
import type { LocationData } from "../Math/index.js";
import { DimensionData } from "./Types/WorldData.types.js";
import { Vector3Like } from "@amodx/math";

class WorldDataHooks {
  static dimension = {
    onNew: (dimension: DimensionData): void => {},
    onRemove: (location: LocationData): void => {},
  };
  static sectors = {
    onNew: (location: LocationData, sector: SectorData): void => {},
    onRemove: (location: LocationData, sector: SectorData): void => {},
  };
}

class WorldRegisterDimensions {
  static add(id: string) {
    const dimesnion = Dimension.CreateNew(id);
    WorldRegister._dimensions.set(id, dimesnion);
    return dimesnion;
  }
  static get(id: string) {
    return WorldRegister._dimensions.get(id);
  }
}

const tempPosition = Vector3Like.Create();

class SectorPool {
  static _secotrs: Sector[] = [];
  static _enabled = false;
  static getSector() {
    if (!this._enabled) return Sector.CreateNew();
    if (this._secotrs.length) return this._secotrs.shift()!;
    return Sector.CreateNew();
  }
  static returnSector(secotr: Sector) {
    secotr.bufferView.fill(0);
  }
}

class WorldRegisterSectors {
  static setSecotrPool(enabled: boolean) {
    SectorPool._enabled = enabled;
    SectorPool._secotrs.length = 0;
  }
  static add(
    dimensionId: string,
    x: number,
    y: number,
    z: number,
    sector: SectorData
  ) {
    let dimension = WorldRegister.dimensions.get(dimensionId);
    if (!dimension) dimension = WorldRegister.dimensions.add(dimensionId);
    WorldSpaces.sector.getPositionVec3Array(x, y, z, sector.position);
    const newSector = new Sector(sector);
    dimension.sectors.set(
      WorldSpaces.hash.hashVec3Array(newSector.position),
      newSector
    );
    return newSector;
  }
  static new(dimensionId: string, x: number, y: number, z: number) {
    if (this.get(dimensionId, x, y, z)) return false;
    let dimension = WorldRegister.dimensions.get(dimensionId);
    if (!dimension) dimension = WorldRegister.dimensions.add(dimensionId);
    const sector = this.add(dimensionId, x, y, z, Sector.CreateNew())!;
    WorldDataHooks.sectors.onNew([dimensionId, x, y, z], sector);
    return true;
  }
  static get(
    dimensionId: string,
    x: number,
    y: number,
    z: number
  ): false | Sector {
    let dimension = WorldRegister.dimensions.get(dimensionId);
    if (!dimension) return false;
    const sector = dimension.sectors.get(
      WorldSpaces.hash.hashVec3(
        WorldSpaces.sector.getPosition(x, y, z, tempPosition)
      )
    );
    return sector || false;
  }
  static remove(dimensionId: string, x: number, y: number, z: number) {
    let dimension = WorldRegister.dimensions.get(dimensionId);
    if (!dimension) return false;
    const position = WorldSpaces.sector.getPosition(x, y, z, tempPosition);
    const sectorKey = WorldSpaces.hash.hashVec3(position);
    const sector = dimension.sectors.get(sectorKey);
    if (!sector) return false;
    if (SectorPool._enabled) SectorPool.returnSector(sector);
    WorldDataHooks.sectors.onRemove(
      [dimensionId, position.x, position.y, position.z],
      sector
    );
    dimension.sectors.delete(sectorKey);
    return true;
  }
}

export class WorldRegister {
  static _dimensions = new Map<string, Dimension>();
  static _hooks = WorldDataHooks;
  static dimensions = WorldRegisterDimensions;
  static sectors = WorldRegisterSectors;

  static clearAll() {
    this._dimensions.clear();
  }
}
