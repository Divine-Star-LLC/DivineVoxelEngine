import type {
  MeshRegisterChunk,
  MeshRegisterDimensions,
  MushRegisterRegion,
  MeshRegisterColumn,
} from "Types/Render/Scene/MeshRegister.types.js";
import type { LocationData } from "Math/index.js";
import type { Mesh } from "@babylonjs/core";
import type { VoxelTemplateSubstanceType } from "Types/Data/Voxels/Voxel.types.js";
import { WorldSpaces } from "../../Data/World/WorldSpaces.js";

export const MeshRegister = {
  _dimensions: <MeshRegisterDimensions>new Map(),

  $INIT() {
    this._dimensions.set("main", new Map());
  },

  clearAll() {
    for (const [dkey, dim] of this._dimensions) {
      this.dimensions.remove(dkey);
    }
    this._dimensions.set("main", new Map());
  },

  dimensions: {
    add(id: string) {
      const dimesnion = new Map();
      MeshRegister._dimensions.set(id, dimesnion);
      return dimesnion;
    },
    get(id: string) {
      return MeshRegister._dimensions.get(id);
    },
    *getAllMeshes(
      id: string
    ): Generator<[location: LocationData, substance: string, mesh: Mesh]> {
      const dimension = MeshRegister._dimensions.get(id);
      if (!dimension) return false;
      for (const [key, region] of dimension) {
        for (const [columnKey, column] of region.columns) {
          for (const [chunkKey, chunk] of column.chunks) {
            for (const [substance, mesh] of chunk) {
              yield [
                [
                  column.location[0],
                  column.location[1],
                  column.location[2] + chunkKey * WorldSpaces.chunk._bounds.y,
                  column.location[3],
                ],
                substance,
                mesh.mesh,
              ];
            }
          }
        }
      }
    },
    remove(id: string) {
      const dimension = MeshRegister._dimensions.get(id);
      if (!dimension) return false;
      dimension.forEach((region) => {
        region.columns.forEach((column) => {
          column.chunks.forEach((chunk) => {
            chunk.forEach((chunkMeshes) => {
              chunkMeshes.mesh.dispose();
            });
          });
        });
      });
      MeshRegister._dimensions.delete(id);
      return true;
    },
  },

  region: {
    add(location: LocationData) {
      let dimension = MeshRegister.dimensions.get(location[0]);
      if (!dimension) {
        dimension = MeshRegister.dimensions.add(location[0]);
      }
      const region = this._getRegionData();
      dimension.set(WorldSpaces.region.getKeyLocation(location), region);
      return region;
    },
    remove(location: LocationData) {
      const region = MeshRegister.region.get(location);
      if (!region) return false;
      const dimension = MeshRegister.dimensions.get(location[0]);
      if (!dimension) return false;
      dimension.delete(WorldSpaces.region.getKeyLocation(location));
      region.columns.forEach((column) => {
        column.chunks.forEach((chunk) => {
          chunk.forEach((chunkMeshes) => {
            chunkMeshes.mesh.dispose();
          });
        });
      });
      return true;
    },
    _getRegionData(): MushRegisterRegion {
      return {
        columns: new Map(),
      };
    },
    get(location: LocationData) {
      const dimension = MeshRegister.dimensions.get(location[0]);
      if (!dimension) return false;
      const region = dimension.get(WorldSpaces.region.getKeyLocation(location));
      if (!region) return false;
      return region;
    },
  },
  column: {
    add(location: LocationData) {
      let region = MeshRegister.region.get(location);
      if (!region) {
        region = MeshRegister.region.add(location);
      }
      const column = this._getColumnData(location);
      region.columns.set(WorldSpaces.column.getIndexLocation(location), column);
      return column;
    },
    remove(location: LocationData) {
      let region = MeshRegister.region.get(location);
      if (!region) return false;
      const index = WorldSpaces.column.getIndexLocation(location);
      const column = region.columns.get(index);
      if (!column) return false;
      region.columns.delete(index);
      if (region.columns.size == 0) {
        MeshRegister.region.remove(location);
      }
      return column;
    },
    _getColumnData(location: LocationData): MeshRegisterColumn {
      return {
        location: [
          location[0],
          ...WorldSpaces.column.getPositionLocation(location).toArray(),
        ] as LocationData,
        chunks: new Map(),
      };
    },
    get(location: LocationData) {
      const region = MeshRegister.region.get(location);
      if (!region) return false;
      return region.columns.get(WorldSpaces.column.getIndexLocation(location));
    },
  },
  chunk: {
    add(
      location: LocationData,
      mesh: Mesh,
      substance: VoxelTemplateSubstanceType
    ) {
      let column = MeshRegister.column.get(location);
      if (!column) {
        column = MeshRegister.column.add(location);
      }
      const index = WorldSpaces.chunk.getIndexLocation(location);
      let chunk = column.chunks.get(index);
      if (!chunk) {
        chunk = new Map();
        column.chunks.set(index, chunk);
      }
      chunk.set(substance, this._getChunkData(mesh));
      return chunk;
    },
    _getChunkData(mesh: Mesh): MeshRegisterChunk {
      return {
        mesh: mesh,
      };
    },
    remove(location: LocationData, substance: VoxelTemplateSubstanceType) {
      const column = MeshRegister.column.get(location);
      if (!column) return false;
      const index = WorldSpaces.chunk.getIndexLocation(location);
      const chunk = column.chunks.get(index);
      if (!chunk) return false;
      const chunkMesh = chunk.get(substance);
      if (!chunkMesh) return false;
      chunk.delete(substance);
      if (chunk.size == 0) {
        column.chunks.delete(index);
      }
      return chunkMesh.mesh;
    },
    get(location: LocationData, substance: VoxelTemplateSubstanceType) {
      const column = MeshRegister.column.get(location);
      if (!column) return false;
      const chunk = column.chunks.get(
        WorldSpaces.chunk.getIndexLocation(location)
      );
      if (!chunk) return false;
      const chunkMesh = chunk.get(substance);
      if (!chunkMesh) return false;
      return chunkMesh;
    },
  },
};
