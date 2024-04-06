//types
import { TextureRotations } from "../../../Types/Geometry.types.js";
import { OverrideManager } from "../../../Rules/Overrides/OverridesManager.js";
import { ShapeTool } from "../../ShapeTool.js";
import { QuadVertexData } from "../../../Classes/VertexData.js";
import { DirectionNames } from "@divinevoxel/core/Types/Util.types.js";
//objects
const addData = (face: DirectionNames) => {
 return ShapeTool.builder.quad
  .setDirection(face)
  .setFlipped(ShapeTool.data.isFaceFlipped())
  .light.add(ShapeTool.data.getWorldLight())
  .textures.add(ShapeTool.data.getTexture())
  .overlayTexture.add(ShapeTool.data.getOverlayTextures())
  .animationState.add(flowAnimationState);
};

const flowAnimationState = new QuadVertexData();
const vertexValue = new QuadVertexData();
const vertexLevel = new QuadVertexData();

let topFaceExposed = false;

export const LiquidVoxelShape = {
 id: "#dve_liquid",

 start() {
  topFaceExposed = false;
  ShapeTool.builder.quad.setDimensions(1, 1).textures.setRoation(0);
  flowAnimationState.setAll(0);
  vertexLevel.setAll(15);
  vertexValue.setAll(0);
 },

 add: {
  top() {
   topFaceExposed = true;

   ShapeTool.data.calculateFlow();
   vertexLevel.setFromQuadData(ShapeTool.data.getWorldLevel());

   vertexValue.set(
    vertexLevel.vertices[1] / 15 - 1,
    vertexLevel.vertices[2] / 15 - 1,
    vertexLevel.vertices[3] / 15 - 1,
    vertexLevel.vertices[4] / 15 - 1
   );

   ShapeTool.builder.quad
    .setTransform(1, 0, vertexValue.vertices[1], 0)
    .setTransform(2, 0, vertexValue.vertices[2], 0)
    .setTransform(3, 0, vertexValue.vertices[3], 0)
    .setTransform(4, 0, vertexValue.vertices[4], 0)
    .textures.setRoation(getAngle());
   addData("top")
    .updatePosition(0.5, 1, 0.5)
    .create()
    .clearTransform()
    .textures.clear();
  },

  bottom() {
   flowAnimationState.setAll(0);
   addData("bottom")
    .updatePosition(0.5, 0, 0.5)
    .create()
    .clearTransform()
    .textures.clear();
  },

  north() {
   flowAnimationState.setAll(1);
   ShapeTool.builder.quad
    .setDirection("north")
    .updatePosition(0.5, 0.5, 1)
    .setTransform(1, 0, vertexValue.vertices[3], 0)
    .setTransform(2, 0, vertexValue.vertices[2], 0)
    .light.add(ShapeTool.data.getWorldLight())
    .overlayTexture.add(ShapeTool.data.getOverlayTextures())
    .animationState.add(flowAnimationState);
   if (topFaceExposed) {
    ShapeTool.builder.quad.textures.advancedUVs.hs1 = Math.abs(
     vertexValue.vertices[3]
    );
    ShapeTool.builder.quad.textures.advancedUVs.hs2 = Math.abs(
     vertexValue.vertices[2]
    );
    ShapeTool.builder.quad.textures.addAdvancedUVs(ShapeTool.data.getTexture());
   } else {
    ShapeTool.builder.quad.textures.add(ShapeTool.data.getTexture());
   }
   ShapeTool.builder.quad.create().clearTransform().textures.clear();
  },

  south() {
   flowAnimationState.setAll(1);
   ShapeTool.builder.quad
    .setDirection("south")
    .updatePosition(0.5, 0.5, 0)
    .setTransform(1, 0, vertexValue.vertices[1], 0)
    .setTransform(2, 0, vertexValue.vertices[4], 0)
    .light.add(ShapeTool.data.getWorldLight())
    .overlayTexture.add(ShapeTool.data.getOverlayTextures())
    .animationState.add(flowAnimationState);
   if (topFaceExposed) {
    ShapeTool.builder.quad.textures.advancedUVs.hs1 = Math.abs(
     vertexValue.vertices[1]
    );
    ShapeTool.builder.quad.textures.advancedUVs.hs2 = Math.abs(
     vertexValue.vertices[4]
    );
    ShapeTool.builder.quad.textures.addAdvancedUVs(ShapeTool.data.getTexture());
   } else {
    ShapeTool.builder.quad.textures.add(ShapeTool.data.getTexture());
   }
   ShapeTool.builder.quad.create().clearTransform().textures.clear();
  },

  east() {
   flowAnimationState.setAll(1);
   ShapeTool.builder.quad
    .setDirection("east")
    .updatePosition(1, 0.5, 0.5)
    .setTransform(1, 0, vertexValue.vertices[4], 0)
    .setTransform(2, 0, vertexValue.vertices[3], 0)
    .light.add(ShapeTool.data.getWorldLight())
    .overlayTexture.add(ShapeTool.data.getOverlayTextures())
    .animationState.add(flowAnimationState);
   if (topFaceExposed) {
    ShapeTool.builder.quad.textures.advancedUVs.hs1 = Math.abs(
     vertexValue.vertices[4]
    );
    ShapeTool.builder.quad.textures.advancedUVs.hs2 = Math.abs(
     vertexValue.vertices[3]
    );
    ShapeTool.builder.quad.textures.addAdvancedUVs(ShapeTool.data.getTexture());
   } else {
    ShapeTool.builder.quad.textures.add(ShapeTool.data.getTexture());
   }
   ShapeTool.builder.quad.create().clearTransform().textures.clear();
  },

  west() {
   flowAnimationState.setAll(1);
   ShapeTool.builder.quad
    .setDirection("west")
    .updatePosition(0, 0.5, 0.5)
    .setTransform(1, 0, vertexValue.vertices[2], 0)
    .setTransform(2, 0, vertexValue.vertices[1], 0)
    .light.add(ShapeTool.data.getWorldLight())
    .overlayTexture.add(ShapeTool.data.getOverlayTextures())
    .animationState.add(flowAnimationState);
   if (topFaceExposed) {
    ShapeTool.builder.quad.textures.advancedUVs.hs1 = Math.abs(
     vertexValue.vertices[2]
    );
    ShapeTool.builder.quad.textures.advancedUVs.hs2 = Math.abs(
     vertexValue.vertices[1]
    );
    ShapeTool.builder.quad.textures.addAdvancedUVs(ShapeTool.data.getTexture());
   } else {
    ShapeTool.builder.quad.textures.add(ShapeTool.data.getTexture());
   }
   ShapeTool.builder.quad.create().clearTransform().textures.clear();
  },
 },
};

OverrideManager.registerOverride("CullFace", "#dve_liquid", "Any", (data) => {
 if (
  data.face == "top" &&
  data.neighborVoxel.getSubstnaceData().isLiquid() && 
  data.currentVoxel.getStringId() != data.neighborVoxel.getStringId()
 ) {
  return true;
 }
 return data.default;
});

const getAngle = (): TextureRotations => {
 if (vertexLevel.isAllEqualTo(15)) {
  flowAnimationState.setAll(0);
  return 0;
 }
 const v1 = vertexLevel.vertices[1];
 const v2 = vertexLevel.vertices[2];
 const v3 = vertexLevel.vertices[3];
 const v4 = vertexLevel.vertices[4];

 if (v1 == v2 && v3 == v4 && v1 == v4 && v2 == v3) {
  flowAnimationState.setAll(0);
  return 0;
 }

 if (v2 == v3 && v1 == v4 && v2 > v1) {
  //flowing south
  flowAnimationState.setAll(1);
  return 0;
 }
 if (v2 == v3 && v1 == v4 && v2 < v1) {
  //flowing north
  flowAnimationState.setAll(2);
  return 0;
 }
 if (v2 == v1 && v3 == v4 && v1 > v4) {
  //flowing east
  flowAnimationState.setAll(2);
  return 90;
 }
 if (v3 == v4 && v2 == v1 && v4 > v1) {
  //flowing west
  flowAnimationState.setAll(1);
  return 90;
 }

 if (v2 < v4) {
  //flowing north west
  flowAnimationState.setAll(2);
  return 315;
 }
 if (v2 > v4) {
  //flowing south east
  flowAnimationState.setAll(1);
  return 315;
 }
 if (v1 > v3) {
  //flowing north east
  flowAnimationState.setAll(2);
  return 45;
 }
 if (v1 < v3) {
  //flowing south west
  flowAnimationState.setAll(1);
  return 45;
 }

 return 0;
};
