import { PerlinNoise3d } from "@amodx/rng/perlin/index";
const perlin = new PerlinNoise3d();
import { WorldCursor } from "@divinevoxel/vlox/Data/Cursor/World/WorldCursor";
import { VoxelCursor } from "@divinevoxel/vlox/Data/Cursor/VoxelCursor";
import { AdvancedBrush } from "@divinevoxel/vlox/Tools/Brush/AdvancedBrushTool";
import { GenerateTree } from "./Tree";

perlin.noiseSeed(13129301280);
const worldCursor = new WorldCursor();
const voxelCursor = new VoxelCursor();

const brush = new AdvancedBrush();

export const PerlinGen = {
  chunkDepth: 16,
  chunkWidth: 16,
  worldHeight: 256,
  minY: 30,
  worldCursor,
  inNoiseRange(x: number, y: number, z: number) {
    const p1 = perlin;
    const [xOffSet, yOffset, zOffSet] = [1000, 100, 10000];
    const scale = 30; // Adjust for smoother or more rugged terrain

    // Basic terrain height based on x and z
    let height = p1.get((x + xOffSet) / scale, 0, (z + zOffSet) / scale) * 0.5;

    // Additional detail layer
    let detail =
      p1.get((x - xOffSet) / 15, (y + yOffset) / 15, (z - zOffSet) / 15) * 0.5;

    // Combine basic height and detail for final noise value
    let r = height + detail;

    // Adjust y position based on noise, simulating elevation changes
    let elevation = y / 100; // Example elevation factor, adjust as needed

    // Voxel placement condition, adjust thresholds as needed
    return r > 0.3 + elevation && r < 0.4 + elevation;
  },

  //1376271

  generateTree() {},
  generateFloodedForest(chunkX: number, chunkZ: number) {
    brush.setDimension("main");
    brush.setId("dve_dream_stone");
    brush.start();
    //  return this.generateBlankChunk(chunkX, chunkZ);
    let totalTrees = 0;
    const dataTool = brush._dt;
    for (let x = chunkX; x < this.chunkWidth + chunkX; x++) {
      for (let z = chunkZ; z < this.chunkDepth + chunkZ; z++) {
        for (let y = 0; y < this.worldHeight; y++) {
          if (y == 0) {
            brush.setId("dve_dream_stone").setXYZ(x, y, z).paint();
            continue;
          }

          if (this.inNoiseRange(x, y, z)) {
            brush.setId("dve_dream_stone");
            brush.setXYZ(x, y, z).paint();
          } else {
            if (y > 20 && this.inNoiseRange(x, y - 1, z)) {
              if (Math.random() > 0.6) {
                brush.setXYZ(x, y, z).setId("dve_dream_grass").paint();
                continue;
              }
              if (Math.random() > 0.6) {
                let height = (Math.random() * 10) >> 0;
                let i = 0;
                while (height--) {
                  brush
                    .setXYZ(x, y + i, z)
                    .setId("dve_dream_stone_pillar")
                    .paint();
                  i++;
                }
                brush
                  .setXYZ(x, y + i, z)
                  .setId("dve_dream_lamp")
                  .paint();
                continue;
              }
              if (totalTrees < 3) {
                if (Math.random() > 0.98) {
                  GenerateTree(
                    brush,
                    x,
                    y,
                    z,
                    "dve_dream_log",
                    "dve_dream_leaves"
                  );
                  totalTrees++;
                  continue;
                }
              }
            }
            if (y <= 20) {
              brush.setId("dve_liquid_dream_ether").setXYZ(x, y, z).paint();
              continue;
            }
          }
        }
      }
    }
    brush.stop();
  },
  generateForest(chunkX: number, chunkZ: number) {
    brush.setDimension("main");
    brush.setId("dve_dream_stone");
    brush.start();
    //  return this.generateBlankChunk(chunkX, chunkZ);
    let totalTrees = 0;
    const dataTool = brush._dt;
    for (let x = chunkX; x < this.chunkWidth + chunkX; x++) {
      for (let z = chunkZ; z < this.chunkDepth + chunkZ; z++) {
        for (let y = 0; y < this.worldHeight; y++) {
          if (y == 0) {
            brush.setId("dve_dream_stone").setXYZ(x, y, z).paint();
            continue;
          }

          if (this.inNoiseRange(x, y, z)) {
            brush.setId("dve_dream_stone");
            brush.setXYZ(x, y, z).paint();
          } else {
            if (y > 20 && this.inNoiseRange(x, y - 1, z)) {
              if (Math.random() > 0.6) {
                brush.setXYZ(x, y, z).setId("dve_dream_grass").paint();
                continue;
              }
              if (Math.random() > 0.6) {
                let height = (Math.random() * 10) >> 0;
                let i = 0;
                while (height--) {
                  brush
                    .setXYZ(x, y + i, z)
                    .setId("dve_dream_stone_pillar")
                    .paint();
                  i++;
                }
                brush
                  .setXYZ(x, y + i, z)
                  .setId("dve_dream_lamp")
                  .paint();
                continue;
              }
              if (totalTrees < 3) {
                if (Math.random() > 0.98) {
                  GenerateTree(
                    brush,
                    x,
                    y,
                    z,
                    "dve_dream_log",
                    "dve_dream_leaves"
                  );
                  totalTrees++;
                  continue;
                }
              }
            }
          }
        }
      }
    }
    brush.stop();
  },
  generateTest(chunkX: number, chunkZ: number) {
    const columnCursor = this.worldCursor.getColumn(chunkX, 0, chunkZ)!;
    voxelCursor.setStringId("dve_dread_stone").process();
    for (let x = chunkX; x < this.chunkWidth + chunkX; x++) {
      for (let z = chunkZ; z < this.chunkDepth + chunkZ; z++) {
        for (let y = 0; y < this.worldHeight; y++) {
          if (y == 0) {
            columnCursor
              .getVoxel(x, y, z)!
              .setId(voxelCursor.id)
              .updateHeightMap(0);
            continue;
          }

          if (this.inNoiseRange(x, y, z)) {
            columnCursor
              .getVoxel(x, y, z)!
              .setId(voxelCursor.id)
              .updateHeightMap(0);
          }
        }
      }
    }
    brush.stop();
  },
};
