import type { FaceDataOverride } from "../Types/Override.types";
import type { DirectionNames } from "@divinevoxel/core/Types/Util.types.js";
import type { CustomVertexData } from "../Types/Geometry.types.js";

//objects
import { LightGradient } from "../Calc/Light/LightGradient.js";
import { FlowGradient } from "../Calc/Flow/FlowGradient.js";
import { OverrideManager } from "../Rules/Overrides/OverridesManager.js";
import { SubstanceRules } from "../Rules/SubstanceRules.js";

//tools
import { BuilderDataTool } from "./BuilderDataTool.js";
import { MesherDataTool } from "@divinevoxel/core/Meshing/Tools/MesherDataTools";

//data
import { FaceNormals } from "@divinevoxel/core/Math/Constants/Faces.js";
import { QuadVertexData } from "@divinevoxel/core/Meshing/";
import { VoxelTemplateDataTool } from "./VoxelTemplateDataTool.js";
import { BinaryNumberTypes } from "@divinestar/binary";

export class VoxelMesherDataTool extends MesherDataTool {
  template = new VoxelTemplateDataTool();
  voxel = new BuilderDataTool();
  nVoxel = new BuilderDataTool();
  faceDataOverride = <FaceDataOverride>{
    face: "south",
    default: false,
    currentVoxel: <BuilderDataTool>{},
    neighborVoxel: <BuilderDataTool>{},
  };
  constructor() {
    super();
    this.faceDataOverride.currentVoxel = this.voxel;
    this.faceDataOverride.neighborVoxel = this.nVoxel;

    (
      [
        ["voxelData", [[], 1, BinaryNumberTypes.Float32]],
        ["cuv3", [[], 3, BinaryNumberTypes.Float32]],
        ["ocuv3", [[], 4, BinaryNumberTypes.Float32]],
        ["colors", [[], 3, BinaryNumberTypes.Float32]],
      ] as const
    ).forEach(([key, data]) => this.attributes.set(key, data as any));
    (
      [
        ["uvs", []],
        ["overlay-uvs", []],
        ["emssive-uvs", []],
      ] as const
    ).forEach(([key, data]) => this.segments.set(key, data as any));
    (
      [
        ["light", new QuadVertexData()],
        ["ao", new QuadVertexData()],
        ["level", new QuadVertexData()],
        ["overlay-uvs", new QuadVertexData()],
      ] as const
    ).forEach(([key, data]) => this.quadVertexData.set(key, data as any));

    (
      [
        ["face-flipped", 0],
        ["texture-index", 0],
      ] as const
    ).forEach(([key, data]) => this.vars.set(key, data as any));
  }

  calculateLight(direction: DirectionNames, ignoreAO = false) {
    if (this.template.isAcive()) {
      this.template._light = this.template._lights[direction];
      this.template._ao = this.template._aos[direction];
      return;
    }
    LightGradient.calculate(direction, this, ignoreAO);
  }

  calculateFlow() {
    if (this.template.isAcive()) {
      return;
    }
    FlowGradient.calculate(this);
  }

  getWorldLight() {
    if (this.template.isAcive()) {
      return this.template._light;
    }
    return this.quadVertexData.get("light")!;
  }

  getWorldAO() {
    if (this.template.isAcive()) {
      return this.template._ao;
    }
    return this.quadVertexData.get("ao")!;
  }

  getWorldLevel() {
    if (this.template.isAcive()) {
      return this.template._level;
    }
    return this.quadVertexData.get("level")!;
  }

  getOverlayTextures() {
    return this.quadVertexData.get("overlay-uvs")!;
  }

  setTexture(uv: number) {
    this.vars.set("texture-index", uv)!;
    return this;
  }

  getTexture() {
    return this.vars.get("texture-index")!;
  }

  setFaceFlipped(value: boolean) {
    this.vars.set("face-flipped", value ? 1 : 0);
    return this;
  }

  isFaceFlipped() {
    return this.vars.get("face-flipped")! == 1;
  }

  isFaceExposed(face: DirectionNames) {
    if (this.template.isAcive()) {
      return this.template.isFaceExposed(face);
    }
    const voxelExists = this.nVoxel.loadInAt(
      FaceNormals[face][0] + this.voxel.x,
      FaceNormals[face][1] + this.voxel.y,
      FaceNormals[face][2] + this.voxel.z
    );

    if (!voxelExists || !this.nVoxel.isRenderable()) return true;
    let finalResult = false;
    let substanceRuleResult = SubstanceRules.exposedCheck(
      this.voxel.getSubstanceStringId(),
      this.nVoxel.getSubstanceStringId()
    );
    this.faceDataOverride.face = face;
    this.faceDataOverride.default = substanceRuleResult;
    finalResult = substanceRuleResult;
    this.faceDataOverride.default = finalResult;
    finalResult = OverrideManager.runOverride(
      "CullFace",
      this.voxel.getShapeId(),
      "Any",
      this.faceDataOverride
    );
    this.faceDataOverride.default = finalResult;
    finalResult = OverrideManager.runOverride(
      "CullFace",
      this.voxel.getShapeId(),
      this.nVoxel.getShapeId(),
      this.faceDataOverride
    );
    this.faceDataOverride.default = finalResult;
    finalResult = OverrideManager.runOverride(
      "CullFace",
      this.voxel.getStringId(),
      this.nVoxel.getShapeId(),
      this.faceDataOverride
    );
    return finalResult;
  }
}
