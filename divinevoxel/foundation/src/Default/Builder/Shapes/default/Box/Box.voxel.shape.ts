import type { FaceDataOverride } from "../../../Types/Override.types.js";
import type { DirectionNames } from "@divinevoxel/core/Types/Util.types.js";

import { OverrideManager } from "../../../Rules/Overrides/OverridesManager.js";
import { ShapeTool } from "../../ShapeTool.js";
import { QuadScalarVertexData } from "@divinevoxel/core/Meshing/";
import { Vec3Array, VoxelFaces } from "@divinevoxel/core/Math/index.js";
import { VoxelGeometry } from "../../../Geometry/VoxelGeometry.js";
import { QuadUVData } from "../../../Geometry/Geometry.types.js";
import { WorldSpaces } from "@divinevoxel/core/Data/World/WorldSpaces.js";
import { VoxelShapeBase } from "../../VoxelShapeBase.js";
import { VoxelShapeManager } from "../../VoxelShapeManager.js";
import { Quad } from "@divinevoxel/core/Meshing/Classes/Quad.js";

const animationState = new QuadScalarVertexData();
const uvs: QuadUVData = [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1],
];
const Quads: Record<DirectionNames, Quad> = {
  top: Quad.Create(
    [
      [0, 1, 0],
      [1, 1, 1],
    ],
    uvs,
    false,
    0
  ),
  bottom: Quad.Create(
    [
      [0, 0, 0],
      [1, 0, 1],
    ],
    uvs,
    false,
    1
  ),
  north: Quad.Create(
    [
      [0, 0, 1],
      [1, 1, 1],
    ],
    uvs,
    false,
    1
  ),
  south: Quad.Create(
    [
      [0, 0, 0],
      [1, 1, 0],
    ],
    uvs,
    false,
    0
  ),
  east: Quad.Create(
    [
      [1, 0, 0],
      [1, 1, 1],
    ],
    uvs,
    false,
    0
  ),
  west: Quad.Create(
    [
      [0, 0, 0],
      [0, 1, 1],
    ],
    uvs,
    false,
    1
  ),
};

class BoxVoxelShapeClass extends VoxelShapeBase {
  id = "#dve_box";

  init(): void {
    //cullface
    OverrideManager.CullFace.register(this.numberId, this.numberId, (data) => {
      return BoxCullFunctions[data.face](data);
    });
    OverrideManager.CullFace.register(
      this.numberId,
      VoxelShapeManager.getMappedId("#dve_panel"),
      (data) => {
        return true;
      }
    );
    OverrideManager.DarkenFaceUnderneath.register(
      this.numberId,
      OverrideManager.ANY,
      (data) => {
        return true;
      }
    );
    OverrideManager.CullFace.register(
      this.numberId,
      VoxelShapeManager.getMappedId("#dve_halfbox"),
      (data) => {
        if (data.face == VoxelFaces.Top) {
          if (data.neighborVoxel.getShapeState() == 0) {
            return true;
          }
          return false;
        }
        return true;
      }
    );
    OverrideManager.CullFace.register(
      this.numberId,
      VoxelShapeManager.getMappedId("#dve_stair"),
      (data) => {
        StairCullFunctions[data.face](data);
        return true;
      }
    );
    //ao
    OverrideManager.AO.register(
      this.numberId,
      VoxelShapeManager.getMappedId("#dve_panel"),
      (data) => {
        return false;
      }
    );
    OverrideManager.CullFace.register(
      this.numberId,
      VoxelShapeManager.getMappedId("#dve_half_box"),
      (data) => {
        if (data.face == VoxelFaces.Top) {
          if (data.neighborVoxel.getShapeState() == 0) {
            return true;
          }
          return false;
        }
        return true;
      }
    );
  }
  add = {
    top() {
      Quads.top.flip = ShapeTool.data.isFaceFlipped();
      VoxelGeometry.addQuad(ShapeTool.data, ShapeTool.origin, Quads.top);
    },
    bottom() {
      Quads.bottom.flip = ShapeTool.data.isFaceFlipped();
      VoxelGeometry.addQuad(ShapeTool.data, ShapeTool.origin, Quads.bottom);
    },
    north() {
      Quads.north.flip = ShapeTool.data.isFaceFlipped();
      VoxelGeometry.addQuad(ShapeTool.data, ShapeTool.origin, Quads.north);
    },
    south() {
      Quads.south.flip = ShapeTool.data.isFaceFlipped();
      VoxelGeometry.addQuad(ShapeTool.data, ShapeTool.origin, Quads.south);
    },
    east() {
      Quads.east.flip = ShapeTool.data.isFaceFlipped();
      VoxelGeometry.addQuad(ShapeTool.data, ShapeTool.origin, Quads.east);
    },
    west() {
      Quads.west.flip = ShapeTool.data.isFaceFlipped();
      VoxelGeometry.addQuad(ShapeTool.data, ShapeTool.origin, Quads.west);
    },
  };
}

export const BoxVoxelShape = new BoxVoxelShapeClass();

const StairCullFunctions: Record<
  VoxelFaces,
  (data: FaceDataOverride) => boolean
> = {
  [VoxelFaces.Top]: (data) => {
    const nVoxelShapeState = data.neighborVoxel.getShapeState();
    if (
      (nVoxelShapeState >= 0 && nVoxelShapeState <= 3) ||
      (nVoxelShapeState >= 8 && nVoxelShapeState <= 11)
    ) {
      return false;
    }
    return true;
  },
  [VoxelFaces.Bottom]: (data) => {
    const nVoxelShapeState = data.neighborVoxel.getShapeState();
    if (
      (nVoxelShapeState >= 4 && nVoxelShapeState <= 7) ||
      (nVoxelShapeState >= 12 && nVoxelShapeState <= 15)
    ) {
      return false;
    }
    return true;
  },
  [VoxelFaces.East]: (data) => {
    const nVoxelShapeState = data.neighborVoxel.getShapeState();
    if (nVoxelShapeState == 1 || nVoxelShapeState == 5) return false;
    return true;
  },
  [VoxelFaces.West]: (data) => {
    const nVoxelShapeState = data.neighborVoxel.getShapeState();
    if (nVoxelShapeState == 3 || nVoxelShapeState == 7) return false;
    return true;
  },
  [VoxelFaces.North]: (data) => {
    const nVoxelShapeState = data.neighborVoxel.getShapeState();
    if (nVoxelShapeState == 0 || nVoxelShapeState == 4) return false;
    return true;
  },
  [VoxelFaces.South]: (data) => {
    const nVoxelShapeState = data.neighborVoxel.getShapeState();
    if (nVoxelShapeState == 2 || nVoxelShapeState == 6) return false;
    return true;
  },
};

//cull leaf faces
const BoxCullFunctions: Record<
  VoxelFaces,
  (data: FaceDataOverride) => boolean
> = {
  [VoxelFaces.Top]: (data) => {
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
  [VoxelFaces.Bottom]: (data) => {
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
  [VoxelFaces.East]: (data) => {
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
  [VoxelFaces.West]: (data) => {
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
  [VoxelFaces.North]: (data) => {
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
  [VoxelFaces.South]: (data) => {
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
