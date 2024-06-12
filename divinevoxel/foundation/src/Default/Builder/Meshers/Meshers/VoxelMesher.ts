import { Mesher } from "../Classes/Mesher.js";
import { BuilderDataTool } from "../../Tools/BuilderDataTool.js";
import { RenderedSubstances } from "../../Rules/RenderedSubstances.js";
import { ShapeTool } from "../../Shapes/ShapeTool.js";
import { BuildNodeMesh, SetNodeMesh } from "../../Tasks/BuidlerTasks.types.js";
class VoxelBuilderBase extends Mesher {
  dataTool = new BuilderDataTool();

  constructor(public id: string) {
    super(id);
    this.dataTool.setMode(BuilderDataTool.Modes.VOXEL_DATA);
  }

  build([location, type, rawVoxelData]: BuildNodeMesh):
    | [SetNodeMesh, ArrayBuffer[]]
    | false {
    if (!this.dataTool.loadInRaw(rawVoxelData).isRenderable()) return false;

    const constructor = this.dataTool.getConstructor();
    const mesher = RenderedSubstances.meshers.get(
      this.dataTool.getSubstnaceData().getRendered()
    );

    if (!mesher || !constructor) return false;
    mesher.resetAll();
    mesher.voxel
      .loadInRaw(rawVoxelData)
      .setMode(BuilderDataTool.Modes.VOXEL_DATA);
    mesher.nVoxel
      .loadInRaw(rawVoxelData)
      .setMode(BuilderDataTool.Modes.VOXEL_DATA);
    ShapeTool.setMesher(mesher);
    ShapeTool.builder.quad.clear().setPosition(0, 0, 0);
    constructor.process(mesher);
    mesher.resetVars();

    const [attributes, buffers] = mesher.getAllAttributes();

    mesher.voxel.setMode(BuilderDataTool.Modes.WORLD);
    mesher.nVoxel.setMode(BuilderDataTool.Modes.WORLD);
    return [[location, attributes], buffers];
  }
}

export const VoxelBuilder = new VoxelBuilderBase("#dve_node_voxel");
