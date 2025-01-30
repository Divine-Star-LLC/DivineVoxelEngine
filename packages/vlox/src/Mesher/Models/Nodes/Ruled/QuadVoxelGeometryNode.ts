import { Vec3Array, Vec4Array, Vector3Like } from "@amodx/math";
import { VoxelFaces } from "../../../../Math";

import { QuadScalarVertexData } from "../../../Geomtry/Primitives/QuadVertexData"
import { QuadVerticies } from "../../../Geomtry/Geometry.types"
import { VoxelQuadGeometryNode } from "../../../../Models/VoxelModel.types";

import { Quad } from "../../../Geomtry/Primitives/Quad"
import { VoxelMesherDataTool } from "../../../../Mesher/Tools/VoxelMesherDataTool";
import { VoxelGeometryBuilder } from "../../../Geomtry/VoxelGeometryBuilder";

import { VoxelGeometryLookUp } from "../../VoxelGeometryLookUp";
import { GeoemtryNode } from "../GeometryNode";
import { VoxelGeometryConstructor } from "../VoxelGeometryConstructor";
import {
  getInterpolationValue,
  shouldCauseFlip,
} from "../../Common/Calc/CalcConstants";

import { VoxelRelativeCubeIndexPositionMap } from "../../../../Models/Indexing/VoxelRelativeCubeIndex";
import {
  QuadVoxelGometryArgs,
  QuadVoxelGometryInputs,
} from "../../../../Models/Input/QuadVoxelGometryInputs";
import { VoxelGeometryTransform } from "../../../../Voxels/Types/VoxelModelCompiledData.types";
import { GetQuadGeometryData } from "../../Common/QuadGeometryNode";
import { UpdateBounds } from "../../Common/BoundsFunctions";
import { VoxelLightData } from "../../../../Voxels/Cursor/VoxelLightData";

const ArgIndexes = QuadVoxelGometryInputs.ArgIndexes;

export class QuadVoxelGometryNode extends GeoemtryNode<
  VoxelQuadGeometryNode,
  QuadVoxelGometryArgs
> {
  quad: Quad;
  quadBounds: [Vec3Array, Vec3Array] = [
    [0, 0, 0],
    [0, 0, 0],
  ];
  vertexWeights: [Vec4Array, Vec4Array, Vec4Array, Vec4Array];
  worldLight: QuadScalarVertexData;
  worldAO: QuadScalarVertexData;
  closestFace: VoxelFaces;
  lightData = new VoxelLightData();

  init(): void {
    this.faceCount = 6;
    this.vertexCount = this.faceCount * 4;

    const { quad, quadBounds, closestFace, vertexWeights } =
      GetQuadGeometryData(this.data, this.transform);
    this.quad = quad;
    this.quadBounds = quadBounds;
    this.vertexWeights = vertexWeights;
    this.closestFace = closestFace;
  }
  isExposed() {
    const trueFaceIndex = this.faceIndex;
    const faceIndexes = this.geomtry.faceCullMap![trueFaceIndex];
    if (!faceIndexes) return true;

    const tool = this.tool;

    for (
      let positionIndex = 0;
      positionIndex < faceIndexes.length;
      positionIndex++
    ) {
      const currentIndex = faceIndexes[positionIndex];
      const p = VoxelRelativeCubeIndexPositionMap[currentIndex];
      const hashed = VoxelGeometryLookUp.getHash(
        tool.nVoxel,
        tool.position.x + p[0],
        tool.position.y + p[1],
        tool.position.z + p[2]
      );

      const offsetBaseGometry = VoxelGeometryLookUp.geometryCache[hashed];
      const offsetConditonalGeometry =
        VoxelGeometryLookUp.conditionalGeometryCache[hashed];

      if (offsetBaseGometry) {
        for (let i = 0; i < offsetBaseGometry.length; i++) {
          const faceIndex = this.geomtry.cullIndex.getValue(
            offsetBaseGometry[i],
            currentIndex,
            trueFaceIndex
          );
          if (
            faceIndex > -1 &&
            !VoxelGeometryLookUp.voxelHash[hashed].isShapeStateFaceTransparent(
              VoxelGeometryLookUp.modCache[hashed],
              VoxelGeometryLookUp.stateCache[hashed],
              offsetBaseGometry[i],
              faceIndex
            )
          ) {
            return false;
          }
        }
      }

      if (!offsetConditonalGeometry) continue;
      for (let i = 0; i < offsetConditonalGeometry.length; i++) {
        const cond = offsetConditonalGeometry[i];
        for (let k = 0; k < cond.length; k++) {
          const faceIndex = this.geomtry.cullIndex.getValue(
            cond[k],
            currentIndex,
            trueFaceIndex
          );
          if (
            faceIndex > -1 &&
            !VoxelGeometryLookUp.voxelHash[
              hashed
            ].isCondtionalStateFaceTransparent(
              VoxelGeometryLookUp.modCache[hashed],
              VoxelGeometryLookUp.stateCache[hashed],
              cond[i],
              faceIndex
            )
          )
            return false;
        }
      }
    }

    return true;
  }

  determineShading() {
    const tool = this.tool;

    const lightData = tool.lightData[VoxelFaces.Up];
    const noAO = this.tool.voxel.isLightSource() || this.tool.voxel.noAO();

    const worldLight = this.worldLight;
    const worldAO = this.worldAO;
    for (let v = 0 as QuadVerticies; v < 4; v++) {
      worldAO.vertices[v] = 0;

      worldLight.vertices[v] = getInterpolationValue(
        lightData as Vec4Array,
        this.vertexWeights[v]
      );

      if (noAO) continue;

      const trueVertexIndex = this.vertexIndex + 4 + v;

      const aoIndexes = this.geomtry.vertexHitMap![trueVertexIndex];

      if (!aoIndexes) continue;

      for (
        let positionIndex = 0;
        positionIndex < aoIndexes.length;
        positionIndex++
      ) {
        const currentIndex = aoIndexes[positionIndex];
        const p = VoxelRelativeCubeIndexPositionMap[currentIndex];

        const hashed = VoxelGeometryLookUp.getHash(
          tool.nVoxel,
          tool.position.x + p[0],
          tool.position.y + p[1],
          tool.position.z + p[2]
        );

        if (VoxelGeometryLookUp.noCastAO[hashed] === true) continue;
        const baseGeo = VoxelGeometryLookUp.geometryCache[hashed];
        const conditonalGeo =
          VoxelGeometryLookUp.conditionalGeometryCache[hashed];

        if (!baseGeo && !conditonalGeo) continue;

        let length = 0;
        let shaded = false;
        if (baseGeo) {
          length = baseGeo.length;
          for (let geoIndex = 0; geoIndex < length; geoIndex++) {
            if (
              this.geomtry.aoIndex.getValue(
                baseGeo[geoIndex],
                currentIndex,
                trueVertexIndex
              )
            ) {
              worldAO.vertices[v] = 1;
              shaded = true;
              break;
            }
          }
        }
        if (!conditonalGeo) continue;
        length = conditonalGeo.length;
        for (
          let condtionsIndex = 0;
          condtionsIndex < length;
          condtionsIndex++
        ) {
          const condiotnalength = conditonalGeo[condtionsIndex].length;
          for (let geoIndex = 0; geoIndex < condiotnalength; geoIndex++) {
            if (
              this.geomtry.aoIndex.getValue(
                conditonalGeo[condtionsIndex][geoIndex],
                currentIndex,
                trueVertexIndex
              )
            ) {
              worldAO.vertices[v] = 1;
              break;
            }
          }
        }
      }
    }
  }
  shouldFlip() {
    if (
      shouldCauseFlip(
        this.worldAO.vertices[0],
        this.worldAO.vertices[1],
        this.worldAO.vertices[2],
        this.worldAO.vertices[3]
      )
    )
      return true;
    return (
      shouldCauseFlip(
        this.lightData.getS(this.worldLight.vertices[0]),
        this.lightData.getS(this.worldLight.vertices[1]),
        this.lightData.getS(this.worldLight.vertices[2]),
        this.lightData.getS(this.worldLight.vertices[3])
      ) ||
      shouldCauseFlip(
        this.lightData.sumRGB(this.worldLight.vertices[0]),
        this.lightData.sumRGB(this.worldLight.vertices[1]),
        this.lightData.sumRGB(this.worldLight.vertices[2]),
        this.lightData.sumRGB(this.worldLight.vertices[3])
      )
    );
  }

  add(
    tool: VoxelMesherDataTool,
    originHash: number,
    origin: Vector3Like,
    args: QuadVoxelGometryArgs
  ) {
    this.tool = tool;
    this.origin = tool.position;

    this.worldAO = tool.vars.ao;
    this.worldLight = tool.vars.light;

    if (args[ArgIndexes.Enabled] && this.isExposed()) {
      tool.calculateFaceData(this.closestFace);
      this.determineShading();

      const quad = this.quad;
      quad.flip = this.shouldFlip() || args[ArgIndexes.Fliped];
      tool.vars.textureIndex = args[ArgIndexes.Texture];

      quad.doubleSided = args[ArgIndexes.DoubleSided];
      const uvs = args[ArgIndexes.UVs];
      //1
      quad.uvs.vertices[0].x = uvs[0][0];
      quad.uvs.vertices[0].y = uvs[0][1];
      //2
      quad.uvs.vertices[1].x = uvs[1][0];
      quad.uvs.vertices[1].y = uvs[1][1];
      //3
      quad.uvs.vertices[2].x = uvs[2][0];
      quad.uvs.vertices[2].y = uvs[2][1];
      //4
      quad.uvs.vertices[3].x = uvs[3][0];
      quad.uvs.vertices[3].y = uvs[3][1];
      VoxelGeometryBuilder.addQuad(tool, origin, quad);

      UpdateBounds(tool, origin, this.quadBounds);
    }

    this.worldLight.setAll(0);
    this.worldAO.setAll(0);
  }
}
