import { WorldGen } from "../WorldGen/WorldGen.js";
export class WorldData {
    builderManager;
    chunkMap;
    UTIL;
    renderDistance = 20;
    chunkProccesor;
    worldGen;
    playerWatcher;
    chunks = {};
    constructor(builderManager, chunkMap, UTIL) {
        this.builderManager = builderManager;
        this.chunkMap = chunkMap;
        this.UTIL = UTIL;
        this.worldGen = new WorldGen(this.chunkMap);
    }
    setPlayerWatcher(playerWatcher) {
        this.playerWatcher = playerWatcher;
    }
    setChunkProcessor(chunkProccesor) {
        this.chunkProccesor = chunkProccesor;
    }
    generateChunkLine(chunkX, chunkZ, direction) {
        if (direction == "north") {
            const newChunkZ = chunkZ + (this.renderDistance / 2) * 16 + 16;
            const removeChunkZ = chunkZ - (this.renderDistance / 2) * 16 + 32;
            const previousMaxChunkRebuild = newChunkZ - 32;
            for (let i = chunkX - 10 * 16; i < chunkX + 10 * 16; i += 16) {
                if (!this.chunks[i]) {
                    this.chunks[i] = [];
                }
                if (!this.chunks[i][previousMaxChunkRebuild]) {
                    const newChunk = this.generateChunk(i, previousMaxChunkRebuild);
                    const template = this.chunkProccesor.makeChunkTemplate(newChunk, i, previousMaxChunkRebuild);
                    this.builderManager.requestChunkBeBuilt(i, previousMaxChunkRebuild, template);
                }
            }
            for (let i = chunkX - 10 * 16; i < chunkX + 10 * 16; i += 16) {
                if (!this.chunks[i]) {
                    this.chunks[i] = [];
                }
                if (this.chunks[i][removeChunkZ]) {
                    this.builderManager.requestChunkBeRemoved(i, removeChunkZ);
                    delete this.chunks[i][removeChunkZ];
                }
                if (!this.chunks[i][newChunkZ]) {
                    const newChunk = this.generateChunk(i, newChunkZ);
                    const template = this.chunkProccesor.makeChunkTemplate(newChunk, i, newChunkZ);
                    this.builderManager.requestChunkBeBuilt(i, newChunkZ, template);
                }
            }
        }
        if (direction == "south") {
            const removeChunkZ = chunkZ + (this.renderDistance / 2) * 16;
            const newChunkZ = chunkZ - (this.renderDistance / 2) * 16;
            for (let i = chunkX - 10 * 16; i < chunkX + 10 * 16; i += 16) {
                if (!this.chunks[i]) {
                    this.chunks[i] = [];
                }
                if (this.chunks[i][removeChunkZ]) {
                    this.builderManager.requestChunkBeRemoved(i, removeChunkZ);
                    delete this.chunks[i][removeChunkZ];
                }
                if (!this.chunks[i][newChunkZ]) {
                    const newChunk = this.generateChunk(i, newChunkZ);
                    const template = this.chunkProccesor.makeChunkTemplate(newChunk, i, newChunkZ);
                    this.builderManager.requestChunkBeBuilt(i, newChunkZ, template);
                }
            }
        }
        if (direction == "east") {
            const newChunkX = chunkX + (this.renderDistance / 2) * 16 + 16;
            const removeChunkX = chunkX - (this.renderDistance / 2) * 16 + 16;
            const previousMaxChunkRebuild = newChunkX - 16;
            for (let i = chunkZ - 10 * 16; i < chunkZ + 10 * 16; i += 16) {
                if (!this.chunks[newChunkX]) {
                    this.chunks[newChunkX] = [];
                }
                if (!this.chunks[newChunkX][i]) {
                    const newChunk = this.generateChunk(newChunkX, i);
                    const template = this.chunkProccesor.makeChunkTemplate(newChunk, newChunkX, i);
                    this.builderManager.requestChunkBeBuilt(newChunkX, i, template);
                }
            }
            for (let i = chunkZ - 10 * 16; i < chunkZ + 10 * 16; i += 16) {
                if (!this.chunks[previousMaxChunkRebuild]) {
                    this.chunks[previousMaxChunkRebuild] = [];
                }
                if (!this.chunks[previousMaxChunkRebuild][i]) {
                    const newChunk = this.generateChunk(previousMaxChunkRebuild, i);
                    const template = this.chunkProccesor.makeChunkTemplate(newChunk, previousMaxChunkRebuild, i);
                    this.builderManager.requestChunkBeBuilt(previousMaxChunkRebuild, i, template);
                }
            }
            for (const checkChunkX of Object.keys(this.chunks)) {
                const chunkXNum = parseInt(checkChunkX);
                if (chunkXNum <= removeChunkX) {
                    for (const chunk of Object.keys(this.chunks[chunkXNum])) {
                        const chunkZ = parseInt(chunk);
                        this.chunks[chunkXNum][chunkZ];
                        this.builderManager.requestChunkBeRemoved(chunkXNum, chunkZ);
                        delete this.chunks[chunkXNum][chunkZ];
                    }
                    delete this.chunks[chunkXNum];
                }
            }
            delete this.chunks[removeChunkX];
        }
        if (direction == "west") {
            const removeChunkX = chunkX + (this.renderDistance / 2) * 16;
            const newChunkX = chunkX - (this.renderDistance / 2) * 16;
            const previousMaxChunkRebuild = newChunkX + 16;
            for (let i = chunkZ - 10 * 16; i < chunkZ + 10 * 16; i += 16) {
                if (!this.chunks[newChunkX]) {
                    this.chunks[newChunkX] = [];
                }
                if (!this.chunks[newChunkX][i]) {
                    const newChunk = this.generateChunk(newChunkX, i);
                    const template = this.chunkProccesor.makeChunkTemplate(newChunk, newChunkX, i);
                    this.builderManager.requestChunkBeBuilt(newChunkX, i, template);
                }
            }
            for (let i = chunkZ - 10 * 16; i < chunkZ + 10 * 16; i += 16) {
                if (!this.chunks[previousMaxChunkRebuild]) {
                    this.chunks[previousMaxChunkRebuild] = [];
                }
                if (!this.chunks[previousMaxChunkRebuild][i]) {
                    const newChunk = this.generateChunk(previousMaxChunkRebuild, i);
                    const template = this.chunkProccesor.makeChunkTemplate(newChunk, previousMaxChunkRebuild, i);
                    this.builderManager.requestChunkBeBuilt(previousMaxChunkRebuild, i, template);
                }
            }
            for (const checkChunkX of Object.keys(this.chunks)) {
                const chunkXNum = parseInt(checkChunkX);
                if (chunkXNum >= removeChunkX) {
                    for (const chunk of Object.keys(this.chunks[chunkXNum])) {
                        const chunkZ = parseInt(chunk);
                        this.chunks[chunkXNum][chunkZ];
                        this.builderManager.requestChunkBeRemoved(chunkXNum, chunkZ);
                        delete this.chunks[chunkXNum][chunkZ];
                    }
                    delete this.chunks[chunkXNum];
                }
            }
            delete this.chunks[removeChunkX];
        }
    }
    generateChunk(chunkX, chunkZ) {
        this.chunks[chunkX] ??= {};
        const newChunk = this.worldGen.generateChunk(chunkX, chunkZ);
        this.chunks[chunkX][chunkZ] = newChunk;
        return newChunk;
    }
    getChunk(chunkX, chunkZ) {
        if (!this.chunks[chunkX]) {
            return false;
        }
        else if (!this.chunks[chunkX][chunkZ]) {
            return false;
        }
        else {
            return this.chunks[chunkX][chunkZ];
        }
    }
    requestBlockAdd(chunkX, chunkZ, x, y, z, blockId = 1) {
        const chunk = this.chunks[chunkX][chunkZ];
        const relativePOS = this._getRelativeChunkPosition(chunkX, chunkZ, x, y, z);
        const relativeX = relativePOS[0];
        const relativeZ = relativePOS[1];
        if (!chunk[relativeX][relativeZ]) {
            chunk[relativeX][relativeZ] ??= [];
            chunk[relativeX][relativeZ][y] = ["dve:voxel1", 0, ""];
            const template = this.chunkProccesor.makeChunkTemplate(chunk, chunkX, chunkZ);
            this.builderManager.requestChunkBeBuilt(chunkX, chunkZ, template);
            this._checkNearbyChunksToRebuild(chunkX, chunkZ, relativeX, relativeZ);
        }
        else if (!chunk[relativeX][relativeZ][y]) {
            chunk[relativeX][relativeZ][y] = ["dve:voxel1", 0, ""];
            const template = this.chunkProccesor.makeChunkTemplate(chunk, chunkX, chunkZ);
            this.builderManager.requestChunkBeBuilt(chunkX, chunkZ, template);
            this._checkNearbyChunksToRebuild(chunkX, chunkZ, relativeX, relativeZ);
        }
        return false;
    }
    _checkNearbyChunksToRebuild(chunkX, chunkZ, relativeX, relativeZ) {
        buildChunkX0: if (relativeX == 0) {
            const newChunkX = chunkX - 16;
            const newChunkZ = chunkZ;
            const chunk = this.getChunk(newChunkX, newChunkZ);
            if (!chunk)
                break buildChunkX0;
            const template = this.chunkProccesor.makeChunkTemplate(chunk, newChunkX, newChunkZ);
            this.builderManager.requestChunkBeBuilt(newChunkX, newChunkZ, template);
        }
        buildChunkX15: if (relativeX == 15) {
            const newChunkX = chunkX + 16;
            const newChunkZ = chunkZ;
            const chunk = this.getChunk(newChunkX, newChunkZ);
            if (!chunk)
                break buildChunkX15;
            const template = this.chunkProccesor.makeChunkTemplate(chunk, newChunkX, newChunkZ);
            this.builderManager.requestChunkBeBuilt(newChunkX, newChunkZ, template);
        }
        buildChunkZ0: if (relativeZ == 0) {
            const newChunkX = chunkX;
            const newChunkZ = chunkZ - 16;
            const chunk = this.getChunk(newChunkX, newChunkZ);
            if (!chunk)
                break buildChunkZ0;
            const template = this.chunkProccesor.makeChunkTemplate(chunk, newChunkX, newChunkZ);
            this.builderManager.requestChunkBeBuilt(newChunkX, newChunkZ, template);
        }
        buildChunkZ15: if (relativeZ == 15) {
            const newChunkX = chunkX;
            const newChunkZ = chunkZ + 16;
            const chunk = this.getChunk(newChunkX, newChunkZ);
            if (!chunk)
                break buildChunkZ15;
            const template = this.chunkProccesor.makeChunkTemplate(chunk, newChunkX, newChunkZ);
            this.builderManager.requestChunkBeBuilt(newChunkX, newChunkZ, template);
        }
        buildChunkX15Z15: if (relativeZ == 15 && relativeX == 15) {
            const newChunkX = chunkX + 16;
            const newChunkZ = chunkZ + 16;
            const chunk = this.getChunk(newChunkX, newChunkZ);
            if (!chunk)
                break buildChunkX15Z15;
            const template = this.chunkProccesor.makeChunkTemplate(chunk, newChunkX, newChunkZ);
            this.builderManager.requestChunkBeBuilt(newChunkX, newChunkZ, template);
        }
        buildChunkX0Z0: if (relativeZ == 0 && relativeX == 0) {
            const newChunkX = chunkX - 16;
            const newChunkZ = chunkZ - 16;
            const chunk = this.getChunk(newChunkX, newChunkZ);
            if (!chunk)
                break buildChunkX0Z0;
            const template = this.chunkProccesor.makeChunkTemplate(chunk, newChunkX, newChunkZ);
            this.builderManager.requestChunkBeBuilt(newChunkX, newChunkZ, template);
        }
        buildChunkX15Z0: if (relativeZ == 0 && relativeX == 15) {
            const newChunkX = chunkX + 16;
            const newChunkZ = chunkZ - 16;
            const chunk = this.getChunk(newChunkX, newChunkZ);
            if (!chunk)
                break buildChunkX15Z0;
            const template = this.chunkProccesor.makeChunkTemplate(chunk, newChunkX, newChunkZ);
            this.builderManager.requestChunkBeBuilt(newChunkX, newChunkZ, template);
        }
        buildChunkX0Z15: if (relativeZ == 15 && relativeX == 0) {
            const newChunkX = chunkX - 16;
            const newChunkZ = chunkZ + 16;
            const chunk = this.getChunk(newChunkX, newChunkZ);
            if (!chunk)
                break buildChunkX0Z15;
            const template = this.chunkProccesor.makeChunkTemplate(chunk, newChunkX, newChunkZ);
            this.builderManager.requestChunkBeBuilt(newChunkX, newChunkZ, template);
        }
    }
    _getRelativeChunkPosition(chunkX, chunkZ, x, y, z) {
        let relativeX = Math.abs(x - chunkX);
        if (x < 0) {
            if (x == chunkX + 15) {
                relativeX = 15;
            }
        }
        let relativeZ = Math.abs(z - chunkZ);
        if (z < 0) {
            if (z == chunkZ + 15) {
                relativeZ = 15;
            }
        }
        if (z > 0) {
            if (z == chunkZ - 15) {
                relativeZ = 15;
            }
        }
        return [relativeX, relativeZ];
    }
    requestBlockRemove(chunkX, chunkZ, x, y, z, blockId = 1) {
        const chunk = this.chunks[chunkX][chunkZ];
        const relativePOS = this._getRelativeChunkPosition(chunkX, chunkZ, x, y, z);
        const relativeX = relativePOS[0];
        const relativeZ = relativePOS[1];
        if (!chunk[relativeX])
            return false;
        if (!chunk[relativeX][relativeZ])
            return false;
        if (chunk[relativeX][relativeZ][y]) {
            delete chunk[relativeX][relativeZ][y];
            this._checkNearbyChunksToRebuild(chunkX, chunkZ, relativeX, relativeZ);
            const template = this.chunkProccesor.makeChunkTemplate(chunk, chunkX, chunkZ);
            this.builderManager.requestChunkBeBuilt(chunkX, chunkZ, template);
            return chunk;
        }
        else {
            return false;
        }
    }
}
