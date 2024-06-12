import { Vector3Like } from "@divinevoxel/core/Math/Vectors.js";
import { VoxelMesherDataTool } from "../Tools/VoxelMesherDataTool.js";
import { VoxelShapeTool } from "../Tools/VoxelShapeTool.js";

export class ShapeToolclass {
  data: VoxelMesherDataTool;
  builder = new VoxelShapeTool();

  origin = Vector3Like.Create();

  setMesher(dataTool: VoxelMesherDataTool) {
    this.data = dataTool;

    this.builder.quad.setMesherTool(dataTool);
  }
}

export const ShapeTool = new ShapeToolclass();
