import type { ConstructorTextureData, RawVoxelData } from "Types/index.js";
import { BuildNodeMesh, SetNodeMesh } from "Types/Tasks/RenderTasks.types.js";
import { DivineVoxelEngineRender as DVER } from "../DivineVoxelEngineRender.js";
import { TextureManager } from "../Nodes/Textures/TextureManager.js";
import { LocationBoundTool } from "../../Tools/Classes/LocationBoundTool.js";
import { NodeManager } from "../Nodes/NodeManager.js";
import { DataTool } from "../../Tools/Data/DataTool.js";
import { EntityTool } from "./EntityTool.js";

export class NodeMeshTool extends LocationBoundTool {
 constructor() {
  super();

  this.voxel.dataTool.setMode(DataTool.VOXEL_DATA_MODE);
 }
 texture = {
  build: (
   textureIdData: ConstructorTextureData,
   textureData: Uint8ClampedArray,
   onDone: (mesh: EntityTool | false) => void
  ) => {
   const textureId = TextureManager.getTextureIndex(textureIdData);
   if (!textureId) return onDone(false);

   DVER.instance.constructorCommManager.runPromiseTasks<BuildNodeMesh>(
    "build-node-mesh",
    [
     this.location,
     "#dve_node_texture",
     {
      textureId: textureId,
      textureData: textureData,
     },
    ],
    [textureData.buffer],
    (data: SetNodeMesh | false) => {
     if (!data) return onDone(false);
     const mesh = NodeManager.meshes.create("#dve_node_texture", data);
     if (!mesh) return onDone(false);

     mesh.unfreezeWorldMatrix();
     (mesh as any).type = "node";
     mesh.parent = DVER.instance.render.fo.activeNode;
     onDone(new EntityTool(mesh));
    }
   );
  },
  buildAsync(
   textureIdData: ConstructorTextureData,
   textureData: Uint8ClampedArray
  ) {
   return new Promise<EntityTool | false>((resolve) => {
    this.build(textureIdData, textureData, (data) => {
     resolve(data);
    });
   });
  },
 };
 voxel = {
  dataTool: new DataTool(),
  build: (
   voxelData: RawVoxelData,
   onDone: (mesh: EntityTool | false) => void
  ) => {
   DVER.instance.constructorCommManager.runPromiseTasks<BuildNodeMesh>(
    "build-node-mesh",
    [this.location, "#dve_node_voxel", voxelData],
    [],
    (data: SetNodeMesh | false) => {
     if (!data) return onDone(false);
     const mesh = NodeManager.meshes.create(
      this.voxel.dataTool.loadInRaw(voxelData).getSubstnaceData().getRendered(),
      data
     );
     if (!mesh) return onDone(false);

     mesh.unfreezeWorldMatrix();
     (mesh as any).type = "node";
     mesh.parent = DVER.instance.render.fo.activeNode;
     onDone(new EntityTool(mesh));
    }
   );
  },
  buildAsync(voxelData: RawVoxelData): Promise<EntityTool | false> {
   return new Promise((resolve) => {
    this.build(voxelData, (data) => {
     resolve(data);
    });
   });
  },
 };
}
