//types
//data
import { $3dCardinalNeighbors } from "../../../Math/CardinalNeighbors.js";
import { WorldSpaces } from "../../../World/WorldSpaces.js";

import { Vec3Array } from "@amodx/math";
import { UpdateTask } from "../../Update/UpdateTask.js";
import { SectorHeightMap } from "../../../World/Sector/SectorHeightMap.js";
import { VoxelLightData } from "../../../Voxels/Cursor/VoxelLightData.js";
import {
  getMinusOneForSun,
  getSunLightForUnderVoxel,
  isLessThanForSunAddDown,
  isLessThanForSunAdd,
} from "./CommonFunctions.js";

const FloodOutPositions: Vec3Array[] = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 0, 1],
  [0, 0, -1],
  [0, 1, 0],
];
const queue: number[] = [];
const lightData = new VoxelLightData();
export function RunWorldSun(tasks: UpdateTask) {
  const [dimension, cx, cy, cz] = tasks.origin;

  const RmaxY = SectorHeightMap.getRelative(tasks.origin);

  const AmaxY = SectorHeightMap.getAbsolute(tasks.origin);

  const maxX = cx + WorldSpaces.sector.bounds.x;
  const maxY = WorldSpaces.world.bounds.MaxY;
  const maxZ = cz + WorldSpaces.sector.bounds.z;

  const sectorCursor = tasks.nDataCursor.getSector(
    tasks.origin[1],
    tasks.origin[2],
    tasks.origin[3]
  );
  if (!sectorCursor) {
    console.warn(
      "Could not load sector when running world sun at ",
      tasks.origin.toString()
    );
    return;
  }
  const minY = AmaxY - 1 < 0 ? 0 : AmaxY;

  const section = sectorCursor.getSection(cx, minY, cz)!;

  const sectionY = section.getPosition()[1] + WorldSpaces.section.bounds.y;

  //fill
  for (let iy = minY; iy < sectionY; iy++) {
    for (let ix = cx; ix < maxX; ix++) {
      for (let iz = cz; iz < maxZ; iz++) {
        const voxel = sectorCursor.getVoxel(ix, iy, iz);
        if (!voxel) continue;
        const l = voxel.getLight();
        if (l < 0) continue;
        voxel.setLight(lightData.setS(0xf, l));
      }
    }
  }
  for (let iy = sectionY; iy < maxY; iy += WorldSpaces.section.bounds.y) {
    const section = sectorCursor.getSection(cx, iy, cz)!;
    const length = section.light.length;
    for (let i = 0; i < length; i++) {
      section.light[i] = lightData.setS(0xf, section.light[i]);
    }
  }

  const maxAcculamteY = AmaxY == RmaxY ? RmaxY + 1 : RmaxY;
  let index = queue.length;
  //accumulate
  for (let iy = minY; iy <= maxAcculamteY; iy++) {
    for (let ix = cx; ix < maxX; ix++) {
      for (let iz = cz; iz < maxZ; iz++) {
        const l = sectorCursor.getVoxel(ix, iy, iz)?.getLight();
        if (l && l < 0 && lightData.getS(l) != 0xf) continue;
        for (let i = 0; i < $3dCardinalNeighbors.length; i++) {
          const n = $3dCardinalNeighbors[i];
          const nx = ix + n[0];
          const ny = iy + n[1];
          const nz = iz + n[2];

          const nVoxel = tasks.nDataCursor.getVoxel(nx, ny, nz);
          if (!nVoxel) continue;
          const nl = nVoxel.getLight();
          if (nl > -1 && lightData.getS(nl) < 0xf) {
            queue[index++] = ix;
            queue[index++] = iy;
            queue[index++] = iz;
            break;
          }
        }
      }
    }
  }

  //flood
  while (queue.length) {
    const x = queue.shift()!;
    const y = queue.shift()!;
    const z = queue.shift()!;
    const sl = tasks.sDataCursor.getVoxel(x, y, z)?.getLight();
    if (!sl || sl < 0) continue;

    for (let i = 0; i < 5; i++) {
      const nx = x + FloodOutPositions[i][0];
      const ny = y + FloodOutPositions[i][1];
      const nz = z + FloodOutPositions[i][2];
      const nVoxel = tasks.nDataCursor.getVoxel(nx, ny, nz);
      if (nVoxel) {
        const nl = nVoxel.getLight();
        if (nl > -1 && isLessThanForSunAdd(nl, sl)) {
          queue.push(nx);
          queue.push(ny);
          queue.push(nz);
          nVoxel.setLight(getMinusOneForSun(sl, nl));
        }
      }
    }

    const nVoxel = tasks.nDataCursor.getVoxel(x, y - 1, z);
    if (nVoxel) {
      const nl = nVoxel.getLight();
      if (nl > -1 && isLessThanForSunAddDown(nl, sl)) {
        if (nVoxel.isAir()) {
          queue.push(x);
          queue.push(y - 1);
          queue.push(z);
          nVoxel.setLight(getSunLightForUnderVoxel(sl, nl));
        } else {
          if (!nVoxel.isOpaque()) {
            queue.push(x);
            queue.push(y - 1);
            queue.push(z);
            nVoxel.setLight(getMinusOneForSun(sl, nl));
          }
        }
      }
    }
  }
}
