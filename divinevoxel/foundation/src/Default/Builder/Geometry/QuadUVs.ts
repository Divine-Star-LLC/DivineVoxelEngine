import {
 AddQuadUVsData,
 AdvancedUVs,
 TextureRotations,
} from "../Types/Geometry.types";

import { DirectionNames } from "@divinevoxel/core/Types/Util.types";

type UVFaceTypes = "top" | "side" | "bottom";
/**
 * |||||||||||||||||||||||||||||||||||||
 * [TOP & BOTTOM]
 * Not Flipped
 *
 * 2: w 0,h 0        3: w 1, h 0
 *          |--------|
 *          |      / |
 *          |   /    |
 *          |/       |
 *          |--------|
 * 1: w 0,h 1        4: w 1,h 1
 *
 * ===============================
 * Flipped
 *
 * 4: w 1,h 0        3: w 0, h 0
 *          |--------|
 *          |\       |
 *          |   \    |
 *          |      \ |
 *          |--------|
 * 1: w 1,h 1        2: w 0, h 1
 *
 *||||||||||||||||||||||||||||||||||||||||
 * [Sides]
 * Not Flipped
 * 4: w 1,h 0        3: w 0, h 0
 *          |--------|
 *          |\       |
 *          |   \    |
 *          |      \ |
 *          |--------|
 * 1: w 1,h 1        2: w 0, h 1
 *
 * ===============================
 * Flipped
 * 2: w 0,h 0        3: w 1, h 0
 *          |--------|
 *          |      / |
 *          |   /    |
 *          |/       |
 *          |--------|
 * 1: w 0,h 1        4: w 1,h 1
 *
 */
export const QuadUVs = {
 uvRotations: <
  Record<
   UVFaceTypes,
   Record<
    TextureRotations,
    (
     uv: number,
     ws: number,
     we: number,
     hs: number,
     he: number,
     flipped: boolean,
     uvs: number[]
    ) => void
   >
  >
 >{
  top: {
   0: (uv, ws, we, hs, he, flipped, uvs) => {
    if (!flipped) {
     uvs.push(ws, he, uv, ws, hs, uv, we, hs, uv, we, he, uv);
    } else {
     uvs.push(we, he, uv, ws, he, uv, ws, hs, uv, we, hs, uv);
    }
   },
   45: (uv, ws, we, hs, he, flipped, uvs) => {
    if (!flipped) {
     uvs.push(0.5, 1, uv, 1, 0.5, uv, 0.5, 0, uv, 0, 0.5, uv);
    } else {
     uvs.push(0, 0.5, uv, 0.5, 1, uv, 1, 0.5, uv, 0.5, 0, uv);
    }
   },
   //-45
   315: (uv, ws, we, hs, he, flipped, uvs) => {
    if (!flipped) {
     uvs.push(1, 0.5, uv, 0.5, 0, uv, 0, 0.5, uv, 0.5, 1, uv);
    } else {
     uvs.push(0.5, 1, uv, 1, 0.5, uv, 0.5, 0, uv, 0, 0.5, uv);
    }
   },
   90: (uv, ws, we, hs, he, flipped, uvs) => {
    if (!flipped) {
     uvs.push(we, he, uv, ws, he, uv, ws, hs, uv, we, hs, uv);
    } else {
     uvs.push(we, hs, uv, we, he, uv, ws, he, uv, ws, hs, uv);
    }
   },
   180: (uv, ws, we, hs, he, flipped, uvs) => {
    if (!flipped) {
     uvs.push(we, hs, uv, we, he, uv, ws, he, uv, ws, hs, uv);
    } else {
     uvs.push(ws, hs, uv, we, hs, uv, we, he, uv, ws, he, uv);
    }
   },
   270: (uv, ws, we, hs, he, flipped, uvs) => {
    if (!flipped) {
     uvs.push(ws, hs, uv, we, hs, uv, we, he, uv, ws, he, uv);
    } else {
     uvs.push(ws, he, uv, ws, hs, uv, we, hs, uv, we, he, uv);
    }
   },
   360: (uv, ws, we, hs, he, flipped, uvs) => {
    if (!flipped) {
     uvs.push(he, we, uv, he, ws, uv, hs, ws, uv, hs, we, uv);
    } else {
     uvs.push(hs, we, uv, he, we, uv, he, ws, uv, hs, ws, uv);
    }
   },
  },
  bottom: {
   0: (uv, ws, we, hs, he, flipped, uvs) => {
    if (!flipped) {
     uvs.push(ws, hs, uv, we, hs, uv, we, he, uv, ws, he, uv);
    } else {
     uvs.push(ws, he, uv, ws, hs, uv, we, hs, uv, we, he, uv);
    }
   },
   90: (uv, ws, we, hs, he, flipped, uvs) => {
    if (!flipped) {
     uvs.push(ws, he, uv, ws, hs, uv, we, hs, uv, we, he, uv);
    } else {
     uvs.push(we, he, uv, ws, he, uv, ws, hs, uv, we, hs, uv);
    }
   },
   45: (uv, ws, we, hs, he, flipped, uvs) => {
    if (!flipped) {
     uvs.push(0.5, 1, uv, 1, 0.5, uv, 0.5, 0, uv, 0, 0.5, uv);
    } else {
     uvs.push(0.5, 1, uv, 1, 0.5, uv, 0.5, 0, uv, 0, 0.5, uv);
    }
   },
   //-45
   315: (uv, ws, we, hs, he, flipped, uvs) => {
    if (!flipped) {
     uvs.push(1, 0.5, uv, 0.5, 0, uv, 0, 0.5, uv, 0.5, 1, uv);
    } else {
     uvs.push(1, 0.5, uv, 0.5, 0, uv, 0, 0.5, uv, 0.5, 1, uv);
    }
   },
   180: (uv, ws, we, hs, he, flipped, uvs) => {
    if (!flipped) {
     uvs.push(we, he, uv, ws, he, uv, ws, hs, uv, we, hs, uv);
    } else {
     uvs.push(we, hs, uv, we, he, uv, ws, he, uv, ws, hs, uv);
    }
   },
   270: (uv, ws, we, hs, he, flipped, uvs) => {
    if (!flipped) {
     uvs.push(we, hs, uv, we, he, uv, ws, he, uv, ws, hs, uv);
    } else {
     uvs.push(ws, hs, uv, we, hs, uv, we, he, uv, ws, he, uv);
    }
   },
   360: (uv, ws, we, hs, he, flipped, uvs) => {
    if (!flipped) {
     uvs.push(he, ws, uv, hs, hs, uv, hs, we, uv, he, we, uv);
    } else {
     uvs.push(he, we, uv, he, ws, uv, hs, ws, uv, hs, we, uv);
    }
   },
  },
  side: {
   0: (uv, ws, we, hs, he, flipped, uvs) => {
    if (!flipped) {
     uvs.push(ws, hs, uv, we, hs, uv, we, he, uv, ws, he, uv);
    } else {
     uvs.push(ws, he, uv, ws, hs, uv, we, hs, uv, we, he, uv);
    }
   },
   90: (uv, ws, we, hs, he, flipped, uvs) => {
    if (!flipped) {
     uvs.push(ws, he, uv, ws, hs, uv, we, hs, uv, we, he, uv);
    } else {
     uvs.push(we, he, uv, ws, he, uv, ws, hs, uv, we, hs, uv);
    }
   },
   45: (uv, ws, we, hs, he, flipped, uvs) => {
    if (!flipped) {
     uvs.push(0.5, 1, uv, 1, 0.5, uv, 0.5, 0, uv, 0, 0.5, uv);
    } else {
     uvs.push(0.5, 1, uv, 1, 0.5, uv, 0.5, 0, uv, 0, 0.5, uv);
    }
   },
   //-45
   315: (uv, ws, we, hs, he, flipped, uvs) => {
    if (!flipped) {
     uvs.push(1, 0.5, uv, 0.5, 0, uv, 0, 0.5, uv, 0.5, 1, uv);
    } else {
     uvs.push(1, 0.5, uv, 0.5, 0, uv, 0, 0.5, uv, 0.5, 1, uv);
    }
   },
   180: (uv, ws, we, hs, he, flipped, uvs) => {
    if (!flipped) {
     uvs.push(we, he, uv, ws, he, uv, ws, hs, uv, we, hs, uv);
    } else {
     uvs.push(we, hs, uv, we, he, uv, ws, he, uv, ws, hs, uv);
    }
   },
   270: (uv, ws, we, hs, he, flipped, uvs) => {
    if (!flipped) {
     uvs.push(we, hs, uv, we, he, uv, ws, he, uv, ws, hs, uv);
    } else {
     uvs.push(ws, hs, uv, we, hs, uv, we, he, uv, ws, he, uv);
    }
   },
   360: (uv, ws, we, hs, he, flipped, uvs) => {
    if (!flipped) {
     uvs.push(he, ws, uv, hs, ws, uv, hs, we, uv, he, we, uv);
    } else {
     uvs.push(he, we, uv, he, ws, uv, hs, ws, uv, hs, we, uv);
    }
   },
  },
 },

 advancedUVs: <
  Record<
   UVFaceTypes,
   (uv: number, data: AdvancedUVs, uvs: number[], flipped: boolean) => void
  >
 >{
  top: (uv, data, uvs, flipped = false) => {
   if (!flipped) {
    uvs.push(
     data.ws1,
     data.he1,
     uv,
     data.ws2,
     data.hs1,
     uv,
     data.we1,
     data.hs2,
     uv,
     data.we2,
     data.he2,
     uv
    );
   } else {
    uvs.push(
     data.ws1,
     data.he1,
     uv,
     data.ws2,
     data.hs1,
     uv,
     data.we1,
     data.hs2,
     uv,
     data.we2,
     data.he2,
     uv
    );
   }
  },
  side: (uv, data, uvs, flipped = false) => {
   if (!flipped) {
    uvs.push(
     data.ws1,
     data.hs1,
     uv,
     data.we1,
     data.hs2,
     uv,
     data.we2,
     data.he1,
     uv,
     data.ws2,
     data.he2,
     uv
    );
    return;
   } else {
    uvs.push(
     data.ws2,
     data.he2,
     uv,
     data.ws1,
     data.hs1,
     uv,
     data.we1,
     data.hs2,
     uv,
     data.we2,
     data.he1,
     uv
    );
   }
  },
 },

 uvFunctions: <Record<DirectionNames, (data: AddQuadUVsData) => void>>{
  top: (data) => {
   QuadUVs.uvRotations.top[data.rotoate](
    data.uv,
    data.width.start,
    data.width.end,
    data.height.start,
    data.height.end,
    data.flipped,
    data.uvs
   );
  },
  bottom: (data) => {
   QuadUVs.uvRotations.bottom[data.rotoate](
    data.uv,
    data.width.start,
    data.width.end,
    data.height.start,
    data.height.end,
    data.flipped,
    data.uvs
   );
  },
  north: (data) => {
   QuadUVs.uvRotations.side[data.rotoate](
    data.uv,
    data.width.start,
    data.width.end,
    data.height.start,
    data.height.end,
    data.flipped,
    data.uvs
   );
  },
  south: (data) => {
   QuadUVs.uvRotations.side[data.rotoate](
    data.uv,
    data.width.start,
    data.width.end,
    data.height.start,
    data.height.end,
    data.flipped,
    data.uvs
   );
  },
  east: (data) => {
   QuadUVs.uvRotations.side[data.rotoate](
    data.uv,
    data.width.start,
    data.width.end,
    data.height.start,
    data.height.end,
    data.flipped,
    data.uvs
   );
  },
  west: (data) => {
   QuadUVs.uvRotations.side[data.rotoate](
    data.uv,
    data.width.start,
    data.width.end,
    data.height.start,
    data.height.end,
    data.flipped,
    data.uvs
   );
  },
 },

 addUVs(data: AddQuadUVsData) {
  this.uvFunctions[data.direction](data);
 },

 addAdvancedUVs(
  direction: DirectionNames,
  uv: number,
  uvs: number[],
  data: AdvancedUVs,
  flipped: boolean
 ) {
  let d: UVFaceTypes = "top";
  if (direction != "top") {
   d = "side";
  }
  this.advancedUVs[d](uv, data, uvs, flipped);
 },
};
