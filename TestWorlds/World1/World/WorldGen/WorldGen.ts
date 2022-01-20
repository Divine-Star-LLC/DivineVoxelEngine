import type { DVEW } from "../../../../out/Meta/World/DVEW";
import type { ChunkData } from "../../../../out/Meta/Chunks/Chunk.types";
export class WorldGen {
 constructor(public DVEW: DVEW) {}

 chunkDepth = 16;
 chunkWidth = 16;
 chunkHeight = 256;

 renderDistance = 20;

 copy(data: any): any {
return [
    ...data
  ];

 }
 generateChunkStressTest(chunkX: number, chunkZ: number): ChunkData {
  //   this.chunkMap.addChunk(chunkX,chunkZ);

  const chunkVoxels: any[][][] = [];
  let dreamStonePillar = this.DVEW.worldGeneration.getVoxelIdFromGlobalPallet(
   "dve:dreamstonepillar:defualt"
  );

  // debugBox = dreamstone;
  let block = [dreamStonePillar, 0, 1, 1, 1, 0xffffffff];

  for (let x = 0; x < +this.chunkWidth; x++) {
   for (let z = 0; z < this.chunkDepth; z++) {
    for (let y = 0; y < this.chunkHeight; y++) {
     chunkVoxels[x] ??= [];
     chunkVoxels[x][z] ??= [];
     chunkVoxels[x][z][y] = this.copy(block);
    }
   }
  }

  return {
   voxels: chunkVoxels,
   maxMinHeight: [],
   heightMap: [],
  };
 }

 generateCrazyChunk(
  chunk: ChunkData,
  minY: number,
  x: number,
  y: number,
  z: number
 ) {
  chunk.maxMinHeight[0] = 0;
  chunk.maxMinHeight[1] = minY;
  const chunkVoxels = chunk.voxels;
  let dreamstone = this.DVEW.worldGeneration.getVoxelIdFromGlobalPallet(
   "dve:dreamstone:defualt"
  );
  let dreamGrasss = this.DVEW.worldGeneration.getVoxelIdFromGlobalPallet(
   "dve:dreamgrass:defualt"
  );

  let dreamGrassVoxel = [dreamGrasss, 0, 1, 1, 1, 0xffffffff];
  let block = [dreamstone, 0, 0xffffffff];
  if (y < Math.floor(Math.random() * minY)) {
   chunkVoxels[x] ??= [];
   chunkVoxels[x][z] ??= [];
   chunkVoxels[x][z][y] = this.copy(block);

   if (y < chunk.maxMinHeight[0]) {
    chunk.maxMinHeight[0] = y;
   }

   if (Math.random() > 0.8) {
    chunkVoxels[x] ??= [];
    chunkVoxels[x][z] ??= [];
    chunkVoxels[x][z][y + 1] = this.copy(dreamGrassVoxel);
   }
  }
 }

 generateSpikeChunk(
  chunk: ChunkData,
  minY: number,
  maxY: number,
  x: number,
  y: number,
  z: number
 ) {
  const chunkVoxels = chunk.voxels;
  let dreamStonePillar = this.DVEW.worldGeneration.getVoxelIdFromGlobalPallet(
   "dve:dreamstonepillar:defualt"
  );
  chunk.maxMinHeight[0] = minY;
  chunk.maxMinHeight[1] = maxY;
  let block = [dreamStonePillar, 0, 0xffffffff];

  if (x == 0 || z == 0 || x == 15 || z == 15) {
   if (
    y == minY ||
    y == minY + 28 ||
    y == minY + 54 ||
    y == minY + 56 ||
    y == minY + 86
   ) {
    chunkVoxels[x] ??= [];
    chunkVoxels[x][z] ??= [];
    chunkVoxels[x][z][y] = this.copy(block);
   }
  }
  if (x == 0 || z == 0 || x == 15 || z == 15) {
   if (
    y == minY + 1 ||
    y == minY + 26 ||
    y == minY + 30 ||
    y == minY + 52 ||
    y == minY + 58 ||
    y == minY + 84 ||
    y == minY + 88
   ) {
    chunkVoxels[x] ??= [];
    chunkVoxels[x][z] ??= [];
    chunkVoxels[x][z][y] = this.copy(block);
   }
  }
  if (x == 1 || z == 1 || x == 14 || z == 14) {
   if (
    y == minY + 2 ||
    y == minY + 24 ||
    y == minY + 32 ||
    y == minY + 52 ||
    y == minY + 60 ||
    y == minY + 82 ||
    y == minY + 86 ||
    y == minY + 90
   ) {
    chunkVoxels[x] ??= [];
    chunkVoxels[x][z] ??= [];
    chunkVoxels[x][z][y] = this.copy(block);
   }
  }
  if (x == 2 || z == 2 || x == 13 || z == 13) {
   if (
    y == minY + 4 ||
    y == minY + 22 ||
    y == minY + 34 ||
    y == minY + 50 ||
    y == minY + 62 ||
    y == minY + 80 ||
    y == minY + 88 ||
    y == minY + 92
   ) {
    chunkVoxels[x] ??= [];
    chunkVoxels[x][z] ??= [];
    chunkVoxels[x][z][y] = this.copy(block);
   }
  }
  if (x == 3 || z == 3 || x == 12 || z == 12) {
   if (
    y == minY + 6 ||
    y == minY + 20 ||
    y == minY + 36 ||
    y == minY + 48 ||
    y == minY + 64 ||
    y == minY + 78 ||
    y == minY + 90 ||
    y == minY + 94
   ) {
    chunkVoxels[x] ??= [];
    chunkVoxels[x][z] ??= [];
    chunkVoxels[x][z][y] = this.copy(block);
   }
  }
  if (x == 4 || z == 4 || x == 11 || z == 11) {
   if (
    y == minY + 8 ||
    y == minY + 18 ||
    y == minY + 38 ||
    y == minY + 46 ||
    y == minY + 66 ||
    y == minY + 74 ||
    y == minY + 96
   ) {
    chunkVoxels[x] ??= [];
    chunkVoxels[x][z] ??= [];
    chunkVoxels[x][z][y] = this.copy(block);
   }
  }
  if (x == 5 || z == 5 || x == 10 || z == 10) {
   if (
    y == minY + 10 ||
    y == minY + 16 ||
    y == minY + 40 ||
    y == minY + 44 ||
    y == minY + 68 ||
    y == minY + 72 ||
    y == minY + 98
   ) {
    chunkVoxels[x] ??= [];
    chunkVoxels[x][z] ??= [];
    chunkVoxels[x][z][y] = this.copy(block);
   }
  }
  if (x == 6 || z == 6 || x == 9 || z == 9) {
   if (
    y == minY + 12 ||
    y == minY + 14 ||
    y == minY + 42 ||
    y == minY + 70 ||
    minY + 100
   ) {
    chunkVoxels[x] ??= [];
    chunkVoxels[x][z] ??= [];
    chunkVoxels[x][z][y] = this.copy(block);
   }
  }

  if (y < minY) {
   chunkVoxels[x] ??= [];
   chunkVoxels[x][z] ??= [];
   chunkVoxels[x][z][y] = this.copy(block);
  }
 }

 generatePondChunk(
  chunk: ChunkData,
  minY: number,
  x: number,
  y: number,
  z: number
 ) {
  const chunkVoxels = chunk.voxels;
  chunk.maxMinHeight[0] = minY - 7;
  chunk.maxMinHeight[1] = minY;

  let dreamstone = this.DVEW.worldGeneration.getVoxelIdFromGlobalPallet(
   "dve:dreamstone:defualt"
  );
  const liquidDreamEther = this.DVEW.worldGeneration.getVoxelIdFromGlobalPallet(
   "dve:liquiddreamether:defualt"
  );
  const liquidDreamEtherVoxel = [liquidDreamEther, 1, 0xffffffff];

  let block = [dreamstone, 0, 0xffffffff];
  if (x == 0 || z == 0 || x == 15 || z == 15) {
   if (y == minY) {
    chunkVoxels[x] ??= [];
    chunkVoxels[x][z] ??= [];
    chunkVoxels[x][z][y] = this.copy(block);
   }
  }
  if (x == 1 || z == 1 || x == 14 || z == 14) {
   if (y == minY - 1) {
    chunkVoxels[x] ??= [];
    chunkVoxels[x][z] ??= [];
    chunkVoxels[x][z][y] = this.copy(block);
   }
  }
  if (x == 2 || z == 2 || x == 13 || z == 13) {
   if (y == minY - 2) {
    chunkVoxels[x] ??= [];
    chunkVoxels[x][z] ??= [];
    chunkVoxels[x][z][y] = this.copy(block);
   }
  }
  if (x == 3 || z == 3 || x == 12 || z == 12) {
   if (y == minY - 3) {
    chunkVoxels[x] ??= [];
    chunkVoxels[x][z] ??= [];
    chunkVoxels[x][z][y] = this.copy(block);
   }
  }
  if (x <= 4 || z <= 4 || x <= 11 || z <= 11) {
   if (y == minY - 4) {
    chunkVoxels[x] ??= [];
    chunkVoxels[x][z] ??= [];
    chunkVoxels[x][z][y] = this.copy(block);
   }
  }
  if (x <= 5 || z <= 5 || x <= 10 || z <= 10) {
   if (y == minY - 5) {
    chunkVoxels[x] ??= [];
    chunkVoxels[x][z] ??= [];
    chunkVoxels[x][z][y] = this.copy(block);
   }
  }
  if (x <= 6 || z <= 6 || x <= 9 || z <= 9) {
   if (y == minY - 6) {
    chunkVoxels[x] ??= [];
    chunkVoxels[x][z] ??= [];
    chunkVoxels[x][z][y] = this.copy(block);
   }
  }

  if (y < minY - 6) {
   chunkVoxels[x] ??= [];
   chunkVoxels[x][z] ??= [];
   chunkVoxels[x][z][y] = this.copy(block);
  }

  if (y >= minY - 6 && y <= minY) {
   if (
    chunkVoxels[x] &&
    chunkVoxels[x][z] &&
    chunkVoxels[x][z][y] == undefined
   ) {
    chunkVoxels[x] ??= [];
    chunkVoxels[x][z] ??= [];
    chunkVoxels[x][z][y] = this.copy(liquidDreamEtherVoxel);
   }
  }
 }

 generateHoleChunk(
  chunk: ChunkData,
  minY: number,
  x: number,
  y: number,
  z: number
 ) {
  const chunkVoxels = chunk.voxels;
  chunk.maxMinHeight[0] = minY - 8;
  chunk.maxMinHeight[1] = minY;

  let dreamstone = this.DVEW.worldGeneration.getVoxelIdFromGlobalPallet(
   "dve:dreamstone:defualt"
  );
  let dreamGrasss = this.DVEW.worldGeneration.getVoxelIdFromGlobalPallet(
   "dve:dreamgrass:defualt"
  );

  let dreamGrassVoxel = [dreamGrasss, 0, 1, 1, 1, 0xffffffff];
  let block = [dreamstone, 0, 0xffffffff];
  if (x == 0 || z == 0 || x == 15 || z == 15) {
   if (y == minY) {
    chunkVoxels[x] ??= [];
    chunkVoxels[x][z] ??= [];
    chunkVoxels[x][z][y] = this.copy(block);
    if (Math.random() > 0.8) {
     chunkVoxels[x] ??= [];
     chunkVoxels[x][z] ??= [];
     chunkVoxels[x][z][y + 1] = this.copy(dreamGrassVoxel);
    }
   }
  }
  if (x == 1 || z == 1 || x == 14 || z == 14) {
   if (y == minY - 1) {
    chunkVoxels[x] ??= [];
    chunkVoxels[x][z] ??= [];
    chunkVoxels[x][z][y] = this.copy(block);
    if (Math.random() > 0.8) {
     chunkVoxels[x] ??= [];
     chunkVoxels[x][z] ??= [];
     chunkVoxels[x][z][y + 1] = this.copy(dreamGrassVoxel);
    }
   }
  }
  if (x == 2 || z == 2 || x == 13 || z == 13) {
   if (y == minY - 2) {
    chunkVoxels[x] ??= [];
    chunkVoxels[x][z] ??= [];
    chunkVoxels[x][z][y] = this.copy(block);
    if (Math.random() > 0.8) {
     chunkVoxels[x] ??= [];
     chunkVoxels[x][z] ??= [];
     chunkVoxels[x][z][y + 1] = this.copy(dreamGrassVoxel);
    }
   }
  }
  if (x == 3 || z == 3 || x == 12 || z == 12) {
   if (y == minY - 3) {
    chunkVoxels[x] ??= [];
    chunkVoxels[x][z] ??= [];
    chunkVoxels[x][z][y] = this.copy(block);
    if (Math.random() > 0.8) {
     chunkVoxels[x] ??= [];
     chunkVoxels[x][z] ??= [];
     chunkVoxels[x][z][y + 1] = this.copy(dreamGrassVoxel);
    }
   }
  }
  if (x == 4 || z == 4 || x == 11 || z == 11) {
   if (y == minY - 4) {
    chunkVoxels[x] ??= [];
    chunkVoxels[x][z] ??= [];
    chunkVoxels[x][z][y] = this.copy(block);
    if (Math.random() > 0.8) {
     chunkVoxels[x] ??= [];
     chunkVoxels[x][z] ??= [];
     chunkVoxels[x][z][y + 1] = this.copy(dreamGrassVoxel);
    }
   }
  }
  if (x == 5 || z == 5 || x == 10 || z == 10) {
   if (y == minY - 5) {
    chunkVoxels[x] ??= [];
    chunkVoxels[x][z] ??= [];
    chunkVoxels[x][z][y] = this.copy(block);
    if (Math.random() > 0.8) {
     chunkVoxels[x] ??= [];
     chunkVoxels[x][z] ??= [];
     chunkVoxels[x][z][y + 1] = this.copy(dreamGrassVoxel);
    }
   }
  }
  if (x == 6 || z == 6 || x == 9 || z == 9) {
   if (y == minY - 6) {
    chunkVoxels[x] ??= [];
    chunkVoxels[x][z] ??= [];
    chunkVoxels[x][z][y] = this.copy(block);
    if (Math.random() > 0.8) {
     chunkVoxels[x] ??= [];
     chunkVoxels[x][z] ??= [];
     chunkVoxels[x][z][y + 1] = this.copy(dreamGrassVoxel);
    }
   }
  }

  if (y < minY - 7) {
   chunkVoxels[x] ??= [];
   chunkVoxels[x][z] ??= [];
   chunkVoxels[x][z][y] = this.copy(block);
   if (Math.random() > 0.8) {
    chunkVoxels[x] ??= [];
    chunkVoxels[x][z] ??= [];
    chunkVoxels[x][z][y + 1] = this.copy(dreamGrassVoxel);
   }
  }
 }
 generateNormalChunk(
  chunk: ChunkData,
  minY: number,
  x: number,
  y: number,
  z: number
 ) {
  const chunkVoxels = chunk.voxels;
  chunk.maxMinHeight[0] = minY;
  chunk.maxMinHeight[1] = minY + 1;
  let dreamGrassBlock = this.DVEW.worldGeneration.getVoxelIdFromGlobalPallet(
   "dve:dreamgrassblock:defualt"
  );
  let dreamGrasss = this.DVEW.worldGeneration.getVoxelIdFromGlobalPallet(
   "dve:dreamgrass:defualt"
  );

  let dreamGrassVoxel = [dreamGrasss, 0, 1, 1, 1, 0xffffffff];
  let block = [dreamGrassBlock, 0];
  if (y < minY) {
   chunkVoxels[x] ??= [];
   chunkVoxels[x][z] ??= [];
   chunkVoxels[x][z][y] = this.copy(block);
  }

  if (y == minY) {
   if (Math.random() > 0.8) {
    chunkVoxels[x] ??= [];
    chunkVoxels[x][z] ??= [];
    chunkVoxels[x][z][y] = this.copy(dreamGrassVoxel);
   }
  }
 }

 generateChunkNormal(chunkX: number, chunkZ: number): ChunkData {
  //   this.chunkMap.addChunk(chunkX,chunkZ);

  const chunkVoxels: any[][][] = [];

  let toss = Math.random();

  const chunk = {
   voxels: chunkVoxels,
   maxMinHeight: [],
   heightMap: [],
  };

  let minY = 60;
  let maxY = 256;
  let spiked = false;
  let crazy = false;
  let hole = false;
  let pond = false;
  let normal = true;
  if (toss < 0.2) {
   crazy = true;
  }
  if (toss > 0.2 && toss < 0.3) {
   spiked = true;
  }
  if (toss > 0.3 && toss < 0.6) {
   hole = true;
  }
  if (toss > 0.6) {
   pond = true;
  }

  if (crazy || spiked || hole || pond) {
   normal = false;
  }

  for (let x = 0; x < +this.chunkWidth; x++) {
   for (let z = 0; z < this.chunkDepth; z++) {
    for (let y = 0; y < this.chunkHeight; y++) {
     if (pond) {
      this.generatePondChunk(chunk, minY, x, y, z);
     }
     if (crazy) {
      this.generateCrazyChunk(chunk, minY, x, y, z);
     }
     if (spiked) {
      this.generateSpikeChunk(chunk, minY, maxY, x, y, z);
     }
     if (hole) {
      this.generateHoleChunk(chunk, minY, x, y, z);
     }
     if (normal) {
      this.generateNormalChunk(chunk, minY, x, y, z);
     }
    }
   }
  }

  return chunk;
 }

 generateChunkLine(
  chunkX: number,
  chunkZ: number,
  direction: "north" | "east" | "south" | "west"
 ) {
  const chunks = this.DVEW.worldData.chunks;
  if (direction == "north") {
   const newChunkZ = chunkZ + (this.renderDistance / 2) * 16 + 16;
   const removeChunkZ = chunkZ - (this.renderDistance / 2) * 16 + 32;
   const previousMaxChunkRebuild = newChunkZ - 32;

   for (let i = chunkX - 10 * 16; i < chunkX + 10 * 16; i += 16) {
    if (!chunks[i]) {
     chunks[i] = [];
    }

    if (!chunks[i][previousMaxChunkRebuild]) {
     const newChunk = this.generateChunkNormal(i, previousMaxChunkRebuild);
     this.DVEW.worldData.setChunk(i, 0,previousMaxChunkRebuild, newChunk);
     this.DVEW.buildChunk(i,0, previousMaxChunkRebuild);
    }
   }
   for (let i = chunkX - 10 * 16; i < chunkX + 10 * 16; i += 16) {
    if (!chunks[i]) {
     chunks[i] = [];
    }
    if (chunks[i][removeChunkZ]) {
     this.DVEW.removeChunk(i, 0,removeChunkZ);
    }
    if (!chunks[i][newChunkZ]) {
     const newChunk = this.generateChunkNormal(i, newChunkZ);
     this.DVEW.worldData.setChunk(i, 0,newChunkZ, newChunk);
     this.DVEW.buildChunk(i,0, newChunkZ);
    }
   }
  }
  if (direction == "south") {
   const removeChunkZ = chunkZ + (this.renderDistance / 2) * 16;
   const newChunkZ = chunkZ - (this.renderDistance / 2) * 16;

   for (let i = chunkX - 10 * 16; i < chunkX + 10 * 16; i += 16) {
    if (!chunks[i]) {
     chunks[i] = [];
    }
    if (chunks[i][removeChunkZ]) {
     this.DVEW.removeChunk(i,0, removeChunkZ);
    }
    if (!chunks[i][newChunkZ]) {
     const newChunk = this.generateChunkNormal(i, newChunkZ);
     this.DVEW.worldData.setChunk(i, 0,newChunkZ, newChunk);
     this.DVEW.buildChunk(i,0, newChunkZ);
    }
   }
  }

  if (direction == "east") {
   const newChunkX = chunkX + (this.renderDistance / 2) * 16 + 16;
   const removeChunkX = chunkX - (this.renderDistance / 2) * 16 + 16;
   const previousMaxChunkRebuild = newChunkX - 16;

   for (let i = chunkZ - 10 * 16; i < chunkZ + 10 * 16; i += 16) {
    if (!chunks[newChunkX]) {
     chunks[newChunkX] = [];
    }

    if (!chunks[newChunkX][i]) {
     const newChunk = this.generateChunkNormal(newChunkX, i);
     this.DVEW.worldData.setChunk(newChunkX,0, i, newChunk);
     this.DVEW.buildChunk(newChunkX,0, i);
    }
   }
   for (let i = chunkZ - 10 * 16; i < chunkZ + 10 * 16; i += 16) {
    if (!chunks[previousMaxChunkRebuild]) {
     chunks[previousMaxChunkRebuild] = [];
    }

    if (!chunks[previousMaxChunkRebuild][i]) {
     const newChunk = this.generateChunkNormal(previousMaxChunkRebuild, i);
     this.DVEW.worldData.setChunk(previousMaxChunkRebuild,0, i, newChunk);
     this.DVEW.buildChunk(previousMaxChunkRebuild,0, i);
    }
   }

   for (const checkChunkX of Object.keys(chunks)) {
    const chunkXNum = Number(checkChunkX);
    if (chunkXNum <= removeChunkX) {
     for (const chunk of Object.keys(chunks[chunkXNum])) {
      const chunkZ = Number(chunk);
      chunks[chunkXNum][chunkZ];
      this.DVEW.builderManager.requestFullChunkBeRemoved(chunkXNum, chunkZ);

      delete chunks[chunkXNum][chunkZ];
     }
     delete chunks[chunkXNum];
    }
   }

   delete chunks[removeChunkX];
  }

  if (direction == "west") {
   const removeChunkX = chunkX + (this.renderDistance / 2) * 16;
   const newChunkX = chunkX - (this.renderDistance / 2) * 16;
   const previousMaxChunkRebuild = newChunkX + 16;

   for (let i = chunkZ - 10 * 16; i < chunkZ + 10 * 16; i += 16) {
    if (!chunks[newChunkX]) {
     chunks[newChunkX] = [];
    }

    if (!chunks[newChunkX][i]) {
     const newChunk = this.generateChunkNormal(newChunkX, i);
     this.DVEW.worldData.setChunk(newChunkX,0, i, newChunk);
     this.DVEW.buildChunk(newChunkX,0, i);
    }
   }
   for (let i = chunkZ - 10 * 16; i < chunkZ + 10 * 16; i += 16) {
    if (!chunks[previousMaxChunkRebuild]) {
     chunks[previousMaxChunkRebuild] = [];
    }

    if (!chunks[previousMaxChunkRebuild][i]) {
     const newChunk = this.generateChunkNormal(newChunkX, i);
     this.DVEW.worldData.setChunk(previousMaxChunkRebuild,0, i, newChunk);
     this.DVEW.buildChunk(previousMaxChunkRebuild,0, i);
    }
   }
   for (const checkChunkX of Object.keys(chunks)) {
    const chunkXNum = Number(checkChunkX);
    if (chunkXNum >= removeChunkX) {
     for (const chunk of Object.keys(chunks[chunkXNum])) {
      const chunkZ = Number(chunk);
      chunks[chunkXNum][chunkZ];
      this.DVEW.builderManager.requestFullChunkBeRemoved(chunkXNum, chunkZ);

      delete chunks[chunkXNum][chunkZ];
     }
     delete chunks[chunkXNum];
    }
   }

   delete chunks[removeChunkX];
  }
  this.DVEW.buildFluidMesh();
 }
}
