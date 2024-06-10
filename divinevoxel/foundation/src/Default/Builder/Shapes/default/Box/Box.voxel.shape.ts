import type { FaceDataOverride } from "../../../Types/Override.types.js";
import type { DirectionNames } from "@divinevoxel/core/Types/Util.types.js";

import { OverrideManager } from "../../../Rules/Overrides/OverridesManager.js";
import { ShapeTool } from "../../ShapeTool.js";
import { QuadVertexData } from "@divinevoxel/core/Meshing/";
import { Vec2Array, Vec3Array } from "@divinevoxel/core/Math/index.js";
import { VoxelGeometry } from "../../../Geometry/VoxelGeometry.js";
import { QuadUVData } from "../../../Geometry/Geometry.types.js";
import { WorldSpaces } from "@divinevoxel/core/Data/World/WorldSpaces.js";

const animationState = new QuadVertexData();
const uvs: QuadUVData = [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1],
];
const Quads: Record<DirectionNames, [start: Vec3Array, end: Vec3Array]> = {
  top: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  bottom: [
    [0, 0, 0],
    [1, 0, 1],
  ],
  north: [
    [0, 0, 1],
    [1, 1, 1],
  ],
  south: [
    [0, 0, 0],
    [1, 1, 0],
  ],
  east: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  west: [
    [0, 0, 0],
    [0, 1, 1],
  ],
};
export const BoxVoxelShape = {
  /*  _createFace() {
  animationState.setAll(
    ShapeTool.data.voxel.getSubstance() == "#dve_flora" ? 3 : 0
  )
  ShapeTool.builder.quad
   .setDimensions(1, 1)
   .setFlipped(ShapeTool.data.isFaceFlipped())
   .AO.add(ShapeTool.data.getWorldAO())
   .light.add(ShapeTool.data.getWorldLight())
   .textures.add(ShapeTool.data.getTexture())
   .overlayTexture.add(ShapeTool.data.getOverlayTextures())
   .animationState.add(animationState)
   .create();
 }, */
  add: {
    top() {
      const { x, y, z } = ShapeTool.data.voxel;

      const voxelPOS = WorldSpaces.voxel.getPositionXYZ(x, y, z);
      VoxelGeometry.addSimpleQuad(
        ShapeTool.data,
        voxelPOS,
        0,
        ShapeTool.data.isFaceFlipped(),
        Quads.top,
        uvs
      );
    },
    bottom() {
      const { x, y, z } = ShapeTool.data.voxel;

      const voxelPOS = WorldSpaces.voxel.getPositionXYZ(x, y, z);
      VoxelGeometry.addSimpleQuad(
        ShapeTool.data,
        voxelPOS,
        1,
        ShapeTool.data.isFaceFlipped(),
        Quads.bottom,
        uvs
      );
    },
    north() {
      const { x, y, z } = ShapeTool.data.voxel;

      const voxelPOS = WorldSpaces.voxel.getPositionXYZ(x, y, z);
      VoxelGeometry.addSimpleQuad(
        ShapeTool.data,
        voxelPOS,
        1,
        ShapeTool.data.isFaceFlipped(),
        Quads.north,
        uvs
      );
    },
    south() {
      const { x, y, z } = ShapeTool.data.voxel;

      const voxelPOS = WorldSpaces.voxel.getPositionXYZ(x, y, z);
      VoxelGeometry.addSimpleQuad(
        ShapeTool.data,
        voxelPOS,
        0,
        ShapeTool.data.isFaceFlipped(),
        Quads.south,
        uvs
      );
    },
    east() {
      const { x, y, z } = ShapeTool.data.voxel;

      const voxelPOS = WorldSpaces.voxel.getPositionXYZ(x, y, z);
      VoxelGeometry.addSimpleQuad(
        ShapeTool.data,
        voxelPOS,
        0,
        ShapeTool.data.isFaceFlipped(),
        Quads.east,
        uvs
      );
    },
    west() {
      const { x, y, z } = ShapeTool.data.voxel;
      const voxelPOS = WorldSpaces.voxel.getPositionXYZ(x, y, z);
      VoxelGeometry.addSimpleQuad(
        ShapeTool.data,
        voxelPOS,
        1,
        ShapeTool.data.isFaceFlipped(),
        Quads.west,
        uvs
      );
    },
  },
};

//cullface
OverrideManager.registerOverride("CullFace", "#dve_box", "#dve_box", (data) => {
  return BoxCullFunctions[data.face](data);
});
OverrideManager.registerOverride("CullFace", "#dve_box", "Panel", (data) => {
  return true;
});
OverrideManager.registerOverride(
  "DarkenFaceUnderneath",
  "#dve_box",
  "All",
  (data) => {
    return true;
  }
);
OverrideManager.registerOverride(
  "CullFace",
  "#dve_box",
  "#dve_halfbox",
  (data) => {
    if (data.face == "top") {
      if (data.neighborVoxel.getShapeState() == 0) {
        return true;
      }
      return false;
    }
    return true;
  }
);
OverrideManager.registerOverride(
  "CullFace",
  "#dve_box",
  "#dve_stair",
  (data) => {
    StairCullFunctions[data.face](data);
    return true;
  }
);
//ao
OverrideManager.registerOverride("AO", "#dve_box", "Panel", (data) => {
  return false;
});
OverrideManager.registerOverride("AO", "#dve_box", "#dve_half_box", (data) => {
  if (data.face == "top") {
    if (data.neighborVoxel.getShapeState() == 0) {
      return true;
    }
    return false;
  }
  return true;
});

const StairCullFunctions: Record<
  DirectionNames,
  (data: FaceDataOverride) => boolean
> = {
  top: (data) => {
    const nVoxelShapeState = data.neighborVoxel.getShapeState();
    if (
      (nVoxelShapeState >= 0 && nVoxelShapeState <= 3) ||
      (nVoxelShapeState >= 8 && nVoxelShapeState <= 11)
    ) {
      return false;
    }
    return true;
  },
  bottom: (data) => {
    const nVoxelShapeState = data.neighborVoxel.getShapeState();
    if (
      (nVoxelShapeState >= 4 && nVoxelShapeState <= 7) ||
      (nVoxelShapeState >= 12 && nVoxelShapeState <= 15)
    ) {
      return false;
    }
    return true;
  },
  east: (data) => {
    const nVoxelShapeState = data.neighborVoxel.getShapeState();
    if (nVoxelShapeState == 1 || nVoxelShapeState == 5) return false;
    return true;
  },
  west: (data) => {
    const nVoxelShapeState = data.neighborVoxel.getShapeState();
    if (nVoxelShapeState == 3 || nVoxelShapeState == 7) return false;
    return true;
  },
  north: (data) => {
    const nVoxelShapeState = data.neighborVoxel.getShapeState();
    if (nVoxelShapeState == 0 || nVoxelShapeState == 4) return false;
    return true;
  },
  south: (data) => {
    const nVoxelShapeState = data.neighborVoxel.getShapeState();
    if (nVoxelShapeState == 2 || nVoxelShapeState == 6) return false;
    return true;
  },
};

//cull leaf faces
const BoxCullFunctions: Record<
  DirectionNames,
  (data: FaceDataOverride) => boolean
> = {
  top: (data) => {
    if (
      data.currentVoxel.getSubstanceStringId() == "#dve_flora" &&
      data.currentVoxel.isSameVoxel(
        data.currentVoxel.location[1],
        data.currentVoxel.location[2] + 1,
        data.currentVoxel.location[3]
      ) &&
      data.currentVoxel.isSameVoxel(
        data.currentVoxel.location[1],
        data.currentVoxel.location[2] + 2,
        data.currentVoxel.location[3]
      )
    ) {
      return false;
    }
    return data.default;
  },
  bottom: (data) => {
    if (
      data.currentVoxel.getSubstanceStringId() == "#dve_flora" &&
      data.currentVoxel.isSameVoxel(
        data.currentVoxel.location[1],
        data.currentVoxel.location[2] - 1,
        data.currentVoxel.location[3]
      ) &&
      data.currentVoxel.isSameVoxel(
        data.currentVoxel.location[1],
        data.currentVoxel.location[2] - 2,
        data.currentVoxel.location[3]
      )
    ) {
      return false;
    }
    return data.default;
  },
  east: (data) => {
    if (
      data.currentVoxel.getSubstanceStringId() == "#dve_flora" &&
      data.currentVoxel.isSameVoxel(
        data.currentVoxel.location[1] + 1,
        data.currentVoxel.location[2],
        data.currentVoxel.location[3]
      ) &&
      data.currentVoxel.isSameVoxel(
        data.currentVoxel.location[1] + 2,
        data.currentVoxel.location[2],
        data.currentVoxel.location[3]
      )
    ) {
      return false;
    }
    return data.default;
  },
  west: (data) => {
    if (
      data.currentVoxel.getSubstanceStringId() == "#dve_flora" &&
      data.currentVoxel.isSameVoxel(
        data.currentVoxel.location[1] - 1,
        data.currentVoxel.location[2],
        data.currentVoxel.location[3]
      ) &&
      data.currentVoxel.isSameVoxel(
        data.currentVoxel.location[1] - 2,
        data.currentVoxel.location[2],
        data.currentVoxel.location[3]
      )
    ) {
      return false;
    }
    return data.default;
  },
  north: (data) => {
    if (
      data.currentVoxel.getSubstanceStringId() == "#dve_flora" &&
      data.currentVoxel.isSameVoxel(
        data.currentVoxel.location[1],
        data.currentVoxel.location[2],
        data.currentVoxel.location[3] + 1
      ) &&
      data.currentVoxel.isSameVoxel(
        data.currentVoxel.location[1],
        data.currentVoxel.location[2],
        data.currentVoxel.location[3] + 2
      )
    ) {
      return false;
    }
    return data.default;
  },
  south: (data) => {
    if (
      data.currentVoxel.getSubstanceStringId() == "#dve_flora" &&
      data.currentVoxel.isSameVoxel(
        data.currentVoxel.location[1],
        data.currentVoxel.location[2],
        data.currentVoxel.location[3] - 1
      ) &&
      data.currentVoxel.isSameVoxel(
        data.currentVoxel.location[1],
        data.currentVoxel.location[2],
        data.currentVoxel.location[3] - 2
      )
    ) {
      return false;
    }
    return data.default;
  },
};
