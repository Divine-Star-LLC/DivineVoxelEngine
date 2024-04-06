import { DirectionNames } from "@divinevoxel/core/Types/Util.types";
import { BuilderDataTool } from "../Tools/BuilderDataTool";

export type FaceDataOverride = {
 face: DirectionNames;
 default: boolean;
 currentVoxel: BuilderDataTool;
 neighborVoxel: BuilderDataTool;
};



export type OverrideTypes = "CullFace" | "AO" | "DarkenFaceUnderneath"| "AOFlipFace" | "FlipFace";
