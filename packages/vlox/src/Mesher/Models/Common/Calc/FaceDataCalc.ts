import type { VoxelMesherDataTool } from "../../../../Mesher/Tools/VoxelMesherDataTool.js";
import { QuadVerticies } from "@amodx/meshing/Geometry.types";
import { VoxelFaces, VoxelFaceDirections } from "../../../../Math/index.js";
import { GradientCheckSets } from "./CalcConstants.js";
import { VoxelLightData } from "../../../../Voxels/Cursor/VoxelLightData.js";

type AllLight = [s: number, r: number, g: number, b: number];

const lightData = new VoxelLightData();
const currentLightValues = new Uint16Array([0, 0, 0, 0]) as any as AllLight;
const loadedLightValues = new Uint16Array([0, 0, 0, 0]) as any as AllLight;
const faceLength = 9 * 4;
const settings = {
  doAO: true,
  doLight: true,
};
export const FaceDataCalc = {
  settings,
  calculate(face: VoxelFaces, tool: VoxelMesherDataTool) {
    let light = tool.voxel.getLight();

    const faceNormal = VoxelFaceDirections[face];
    const nVoxel = tool.nVoxel.getVoxel(
      tool.position.x + faceNormal[0],
      tool.position.y + faceNormal[1],
      tool.position.z + faceNormal[2]
    );

    const otherLight = nVoxel?.getLight() || 0;
    light = otherLight >= 0 ? otherLight : light >= 0 ? light : 0;

    for (let vertex: QuadVerticies = <QuadVerticies>0; vertex < 4; vertex++) {
      if (settings.doLight) {
        tool.lightData[face][vertex] = light;
        lightData.getLightValuesToRef(light, currentLightValues);
      }

      for (let i = 0; i < 9; i += 3) {
        const loadedVoxel = tool.nVoxel.getVoxel(
          GradientCheckSets[face][vertex][i] + tool.position.x,
          GradientCheckSets[face][vertex][i + 1] + tool.position.y,
          GradientCheckSets[face][vertex][i + 2] + tool.position.z
        );

        if (!settings.doLight || !loadedVoxel) continue;
        const nl = loadedVoxel.getLight();
        if (nl <= 0) continue;
        /*
      Do Light
      */
        lightData.getLightValuesToRef(nl, loadedLightValues);

        currentLightValues[0] =
          currentLightValues[0] < loadedLightValues[0]
            ? loadedLightValues[0]
            : currentLightValues[0];

        currentLightValues[1] =
          currentLightValues[1] < loadedLightValues[1]
            ? loadedLightValues[1]
            : currentLightValues[1];

        currentLightValues[2] =
          currentLightValues[2] < loadedLightValues[2]
            ? loadedLightValues[2]
            : currentLightValues[2];

        currentLightValues[3] =
          currentLightValues[3] < loadedLightValues[3]
            ? loadedLightValues[3]
            : currentLightValues[3];
      }

      tool.lightData[face][vertex] =
        lightData.setLightValues(currentLightValues);
    }
  },
};
