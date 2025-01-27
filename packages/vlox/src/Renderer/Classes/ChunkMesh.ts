import { ChunkMeshInterface } from "../DVEChunkMeshInterface";
import { VoxelEffect } from "../../Voxels/Effects/VoxelEffect";
import { Vec3Array } from "@amodx/math";

export class ChunkMesh {
  meshes = new Map<string, ChunkMeshInterface>();
  effects = new Map<string, VoxelEffect>();

  constructor(public location: Vec3Array) {}

  dispose() {
    for (const [key, effect] of this.effects) {
      effect.dispose();
    }
    for (const [key, mesh] of this.meshes) {
      mesh.dispose();
    }
  }
}
