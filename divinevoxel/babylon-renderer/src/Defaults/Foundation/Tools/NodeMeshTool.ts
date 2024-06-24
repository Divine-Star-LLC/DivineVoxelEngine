import type { RawVoxelData } from "@divinevoxel/core/Types/index.js";
import {
  BuildNodeMesh,
  SetNodeMesh,
} from "@divinevoxel/foundation/Default/Builder/Tasks/BuidlerTasks.types.js";
import {
  DivineVoxelEngineRender as DVER,
  DivineVoxelEngineRender,
} from "@divinevoxel/core/Contexts/Render/DivineVoxelEngineRender.js";
import { TextureManager } from "@divinevoxel/foundation/Textures/TextureManager.js";
import { LocationBoundTool } from "@divinevoxel/foundation/Default/Tools/Classes/LocationBoundTool.js";
import type { ConstructorTextureData } from "@divinevoxel/foundation/Textures/Constructor.types.js";

import { DataTool } from "@divinevoxel/foundation/Default/Tools/Data/DataTool.js";
import { EntityTool } from "./EntityTool.js";
import { DVEBabylonRenderer } from "../../../DVEBabylonRenderer.js";
import { AddVoxelData } from "@divinevoxel/foundation/Data/Types/WorldData.types";

import type { Mesh } from "@babylonjs/core";
import { LocationData, Vec3Array } from "@divinevoxel/core/Math/index.js";

export class NodeMeshTool {
  dimension = "main";
  constructor() {
    this.voxel.dataTool.setMode(DataTool.Modes.VOXEL_DATA);
  }
  texture = {
    buildMesh: (
      location: LocationData,
      textureIdData: ConstructorTextureData,
      rawTextureData: Uint8ClampedArray | null | undefined,
      onDone: (mesh: Mesh | false) => void
    ) => {
      const textureId = TextureManager.getTextureIndex(textureIdData);
      if (!textureId) return onDone(false);

      const textureData = TextureManager.getTextureData(textureIdData);
      if (!textureData) throw new Error(`${textureIdData} does not exist`);

      if (!rawTextureData) {
        if (textureData.rawData) {
          rawTextureData =
            Array.isArray(textureData.rawData!) &&
            !(textureData.rawData instanceof Uint8ClampedArray)
              ? textureData.rawData![0]
              : textureData.rawData!;
        } else {
          throw new Error(
            `Could not find raw texture data for texture ${textureIdData.toString()}`
          );
        }
      }
      DVER.instance.core.threads.construcotrs.runPromiseTasks<BuildNodeMesh>(
        "build-node-mesh",
        [
          location,
          "#dve_node_texture",
          {
            textureId: textureId,
            textureData: rawTextureData,
          },
        ],
        [],
        (data: SetNodeMesh | false) => {
          if (!data) return onDone(false);
          const mesh = DVEBabylonRenderer.instance.nodes.meshes
            .get("#dve_node_texture")
            .createMesh([data[0][1], data[0][2], data[0][3]], data[1]);
          if (!mesh) return onDone(false);

          mesh._mesh.unfreezeWorldMatrix();

          (mesh._mesh as any).type = "node";
          mesh._mesh.parent =
            DVEBabylonRenderer.instance.foManager.getActiveNode()?._node ||
            null;
          onDone(mesh._mesh);
        }
      );
    },

    buildMeshAsync: (
      location: Vec3Array,
      textureIdData: ConstructorTextureData,
      textureData: Uint8ClampedArray | null = null
    ) => {
      return new Promise<Mesh | false>((resolve) => {
        this.texture.buildMesh(
          [this.dimension, ...location],
          textureIdData,
          textureData,
          (data) => {
            resolve(data);
          }
        );
      });
    },

    buildEntityTool: (
      location: Vec3Array,
      textureIdData: ConstructorTextureData,
      textureData: Uint8ClampedArray,
      onDone: (mesh: EntityTool | false) => void
    ) => {
      this.texture.buildMesh(
        [this.dimension, ...location],
        textureIdData,
        textureData,
        (mesh) => {
          if (!mesh) return onDone(false);
          onDone(new EntityTool(mesh));
        }
      );
    },

    buildEntityToolAsync(
      location: Vec3Array,
      textureIdData: ConstructorTextureData,
      textureData: Uint8ClampedArray
    ) {
      return new Promise<EntityTool | false>((resolve) => {
        this.buildEntityTool(location, textureIdData, textureData, (data) => {
          resolve(data);
        });
      });
    },
  };
  voxel = {
    dataTool: new DataTool(),

    buildMesh: (
      location: Vec3Array,
      voxelData: RawVoxelData | Partial<AddVoxelData>,
      onDone: (mesh: Mesh | false) => void
    ) => {
      if (!Array.isArray(voxelData)) {
        voxelData = DataTool.VoxelDataToRaw(AddVoxelData.Create(voxelData));
      }

      DVER.instance.core.threads.construcotrs.runPromiseTasks<BuildNodeMesh>(
        "build-node-mesh",
        [[this.dimension, ...location], "#dve_node_voxel", voxelData],
        [],
        (data: SetNodeMesh | false) => {
          if (!data) return onDone(false);

          if (Array.isArray(voxelData)) {
            this.voxel.dataTool.loadInRaw(voxelData);
          } else {
            this.voxel.dataTool.loadInData(voxelData);
          }

          const mesh = DVEBabylonRenderer.instance.nodes.meshes
            .get(this.voxel.dataTool.getSubstnaceData().getRendered())
            .createMesh([data[0][1], data[0][2], data[0][3]], data[1]);
          if (!mesh) return onDone(false);

          mesh._mesh.unfreezeWorldMatrix();
          (mesh._mesh as any).type = "node";
          mesh._mesh.parent =
            DVEBabylonRenderer.instance.foManager.getActiveNode()?._node ||
            null;
          onDone(mesh._mesh);
        }
      );
    },

    buildMeshAsync(
      location: Vec3Array,
      voxelData: RawVoxelData | Partial<AddVoxelData>
    ): Promise<Mesh | false> {
      return new Promise((resolve) => {
        this.buildMesh(location, voxelData, (data) => {
          resolve(data);
        });
      });
    },

    buildEntityTool: (
      location: Vec3Array,
      voxelData: RawVoxelData | Partial<AddVoxelData>,
      onDone: (mesh: EntityTool | false) => void
    ) => {
      this.voxel.buildMesh(location, voxelData, (mesh) => {
        if (!mesh) return onDone(false);
        onDone(new EntityTool(mesh));
      });
    },

    buildEntityToolAsync: (
      location: Vec3Array,
      voxelData: RawVoxelData | Partial<AddVoxelData>
    ): Promise<EntityTool | false> => {
      return new Promise((resolve) => {
        this.voxel.buildEntityTool(location, voxelData, (data) => {
          resolve(data);
        });
      });
    },
  };
}
