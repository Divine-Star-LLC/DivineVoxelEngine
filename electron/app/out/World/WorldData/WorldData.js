//obejcts
import { DVEW } from "../DivineVoxelEngineWorld.js";
import { Util } from "../../Global/Util.helper.js";
const voxelPaletteGetFunctions = {
    global: (voxelId, voxelStateId) => {
        const paletteId = DVEW.worldGeneration.voxelPalette.getVoxelPaletteIdFromGlobalPalette(voxelId, voxelStateId);
        if (paletteId) {
            return DVEW.worldGeneration.paintVoxel(paletteId);
        }
        return -1;
    },
    "per-region": (voxelId, voxelStateId, region) => {
        if (!region)
            return -1;
        const paletteId = DVEW.worldGeneration.voxelPalette.getVoxelPaletteIdFromRegion(region, voxelId, voxelStateId);
        if (paletteId) {
            return DVEW.worldGeneration.paintVoxel(paletteId);
        }
        else {
            const newPaletteId = DVEW.worldGeneration.voxelPalette.addToRegionsVoxelPalette(region, voxelId, voxelStateId);
            if (!newPaletteId)
                return -1;
            return DVEW.worldGeneration.paintVoxel(newPaletteId);
        }
    },
};
/**# World Data
 * ---
 * Handles all the game worlds data.
 * Also handles getting and setting data.
 */
export const WorldData = {
    regions: {},
    chunks: {},
    _RGBLightRemoveQue: [],
    _RGBLightUpdateQue: [],
    _chunkRebuildQue: [],
    _chunkRebuildQueMap: {},
    infoByte: Util.getInfoByte(),
    lightByte: Util.getLightByte(),
    voxelByte: Util.getVoxelByte(),
    _3dArray: Util.getFlat3DArray(),
    worldBounds: Util.getWorldBounds(),
    getRGBLightUpdateQue() {
        return this._RGBLightUpdateQue;
    },
    clearRGBLightUpdateQue() {
        this._RGBLightUpdateQue = [];
    },
    getRGBLightRemoveQue() {
        return this._RGBLightRemoveQue;
    },
    clearRGBLightRemoveQue() {
        this._RGBLightRemoveQue = [];
    },
    getChunkRebuildQue() {
        return this._chunkRebuildQue;
    },
    getSubstanceNeededToRebuild(chunkX, chunkY, chunkZ) {
        return this._chunkRebuildQueMap[`${chunkX}-${chunkZ}-${chunkY}`];
    },
    clearChunkRebuildQue() {
        this._chunkRebuildQue = [];
        this._chunkRebuildQueMap = {};
    },
    runRebuildCheck(x, y, z) {
        DVEW.queues.addToRebuildQue(x, y, z, "all");
        DVEW.queues.addToRebuildQue(x + 1, y, z, "all");
        DVEW.queues.addToRebuildQue(x - 1, y, z, "all");
        DVEW.queues.addToRebuildQue(x, y + 1, z, "all");
        DVEW.queues.addToRebuildQue(x, y - 1, z, "all");
        DVEW.queues.addToRebuildQue(x, y, z + 1, "all");
        DVEW.queues.addToRebuildQue(x, y, z - 1, "all");
    },
    addToRebuildQue(x, y, z, substance) {
        const chunk = this.getChunk(x, y, z);
        if (!chunk)
            return;
        const chunkPOS = this.worldBounds.getChunkPosition(x, y, z);
        const chunkKey = this.worldBounds.getChunkKey(chunkPOS);
        if (!this._chunkRebuildQueMap[chunkKey]) {
            this._chunkRebuildQue.push([chunkPOS.x, chunkPOS.y, chunkPOS.z]);
            //@ts-ignore
            this._chunkRebuildQueMap[chunkKey] = {};
            this._chunkRebuildQueMap[chunkKey][substance] = true;
        }
        else {
            this._chunkRebuildQueMap[chunkKey][substance] = true;
        }
    },
    getCurrentWorldDataSize() {
        const data = JSON.stringify(this.regions);
        return new Blob([data]).size;
    },
    getCurrentWorldDataString() {
        return JSON.stringify(this.regions);
    },
    setAir(x, y, z, lightValue) {
        let data = this.lightByte.encodeLightIntoVoxelData(0, lightValue);
        this.setData(x, y, z, data);
    },
    setLight(x, y, z, lightValue) {
        let data = this.getData(x, y, z);
        if (data === false)
            return;
        data = this.lightByte.encodeLightIntoVoxelData(data, lightValue);
        this.setData(x, y, z, data);
    },
    getLight(x, y, z) {
        const voxel = this.getVoxel(x, y, z);
        if (voxel) {
            if (voxel[0] == -1) {
                return this.voxelByte.decodeLightFromVoxelData(voxel[1]);
            }
            else {
                const voxelData = voxel[0];
                if (voxelData.lightSource && voxelData.lightValue) {
                    return voxelData.lightValue;
                }
                if (voxelData.substance == "solid") {
                    return 0;
                }
                return this.voxelByte.decodeLightFromVoxelData(voxel[2]);
            }
        }
        return 0;
    },
    removeData(x, y, z) {
        const region = this.getRegion(x, y, z);
        if (!region) {
            return false;
        }
        const chunk = this.getChunk(x, y, z);
        if (!chunk || chunk.isEmpty) {
            return false;
        }
        const voxelPOS = this.worldBounds.getVoxelPosition(x, y, z);
        if (this._3dArray.getValueUseObj(voxelPOS, chunk.voxels)) {
            this._3dArray.setValueUseObj(voxelPOS, chunk.voxels, 0);
        }
        else {
            return false;
        }
    },
    getData(x, y, z) {
        const region = this.getRegion(x, y, z);
        if (!region) {
            return false;
        }
        const chunk = this.getChunk(x, y, z);
        if (!chunk || chunk.isEmpty) {
            return false;
        }
        return this._3dArray.getValueUseObj(this.worldBounds.getVoxelPosition(x, y, z), chunk.voxels);
    },
    setData(x, y, z, data) {
        const region = this.getRegion(x, y, z);
        if (!region) {
            return -1;
        }
        const chunk = this.getChunk(x, y, z);
        if (!chunk || chunk.isEmpty) {
            return -1;
        }
        return this._3dArray.setValueUseObj(this.worldBounds.getVoxelPosition(x, y, z), chunk.voxels, data);
    },
    getVoxel(x, y, z) {
        const region = this.getRegion(x, y, z);
        if (!region)
            return false;
        const voxelData = this.getData(x, y, z);
        if (voxelData < 0)
            return false;
        let globalPalette = true;
        if (region.palette) {
            globalPalette = false;
        }
        if (voxelData) {
            const voxelId = this.voxelByte.getId(voxelData);
            if (voxelId == 0) {
                return [-1, voxelData, 0];
            }
            else {
                let voxelTrueID = "";
                let voxelState = "";
                if (globalPalette) {
                    const check = DVEW.worldGeneration.voxelPalette.getVoxelDataFromGlobalPalette(voxelId);
                    if (check) {
                        voxelTrueID = check[0];
                        voxelState = check[1];
                    }
                    else {
                        return false;
                    }
                }
                else {
                    const check = DVEW.worldGeneration.voxelPalette.getVoxelDataFromRegion(region, voxelId);
                    if (check) {
                        voxelTrueID = check[0];
                        voxelState = check[1];
                    }
                    else {
                        return false;
                    }
                }
                const voxel = DVEW.voxelManager.getVoxel(voxelTrueID);
                return [voxel, voxelState, voxelData];
            }
        }
        else {
            return false;
        }
    },
    addRegion(x, y, z) {
        let regionPalette = DVEW.engineSettings.settings.world?.voxelPaletteMode == "per-region";
        const newRegion = DVEW.worldGeneration.getBlankRegion(regionPalette);
        const regionKey = this.worldBounds.getRegionKeyFromPosition(x, y, z);
        this.regions[regionKey] = newRegion;
        return newRegion;
    },
    getRegion(x, y, z) {
        const regionKey = this.worldBounds.getRegionKeyFromPosition(x, y, z);
        if (!this.regions[regionKey]) {
            return false;
        }
        return this.regions[regionKey];
    },
    addChunk(x, y, z) {
        const chunk = DVEW.worldGeneration.getBlankChunk(false);
        this.setChunk(x, y, z, chunk);
        return chunk;
    },
    paintVoxel(voxelId, voxelStateId, x, y, z) {
        let region = this.getRegion(x, y, z);
        if (!region) {
            region = this.addRegion(x, y, z);
        }
        let chunk = this.getChunk(x, y, z);
        if (!chunk) {
            chunk = this.addChunk(x, y, z);
        }
        const data = voxelPaletteGetFunctions[
        //@ts-ignore
        DVEW.engineSettings.settings.world?.voxelPaletteMode](voxelId, voxelStateId, region);
        if (data < 0)
            return;
        this._3dArray.setValueUseObj(this.worldBounds.getVoxelPosition(x, y, z), chunk.voxels, data);
        if (DVEW.engineSettings.settings.lighting?.autoRGBLight) {
            const voxel = DVEW.voxelManager.getVoxel(voxelId);
            if (voxel.lightSource && voxel.lightValue) {
                DVEW.queues.addToRGBUpdateQue(x, y, z);
            }
        }
    },
    insertData(x, y, z, data) {
        let region = this.getRegion(x, y, z);
        if (!region) {
            region = this.addRegion(x, y, z);
        }
        let chunk = this.getChunk(x, y, z);
        if (!chunk) {
            chunk = this.addChunk(x, y, z);
        }
        this._3dArray.setValueUseObj(this.worldBounds.getVoxelPosition(x, y, z), chunk.voxels, data);
    },
    getChunk(x, y, z) {
        const region = this.getRegion(x, y, z);
        if (!region)
            return false;
        const chunkKey = this.worldBounds.getChunkKeyFromPosition(x, y, z);
        if (!region.chunks[chunkKey])
            return false;
        return region.chunks[chunkKey];
    },
    removeChunk(x, y, z) {
        const region = this.getRegion(x, y, z);
        if (!region)
            return false;
        const chunks = region.chunks;
        delete chunks[this.worldBounds.getChunkKeyFromPosition(x, y, z)];
    },
    setChunk(x, y, z, chunk, doNotSyncInThreads = false) {
        let region = this.getRegion(x, y, z);
        if (!region) {
            region = this.addRegion(x, y, z);
        }
        const chunkPOS = this.worldBounds.getChunkPosition(x, y, z);
        const chunkKey = this.worldBounds.getChunkKey(chunkPOS);
        const chunks = region.chunks;
        chunk.position[0] = chunkPOS.x;
        chunk.position[1] = chunkPOS.y;
        chunk.position[2] = chunkPOS.z;
        chunks[chunkKey] = chunk;
        if (doNotSyncInThreads)
            return;
        DVEW.builderCommManager.syncChunkInAllBuilders(chunkPOS.x, chunkPOS.y, chunkPOS.z);
        DVEW.propagationCommManager.syncChunkInAllWorldGens(chunkPOS.x, chunkPOS.y, chunkPOS.z);
    },
    async requestVoxelAdd(voxelId, voxelStateId, x, y, z) {
        let region = this.getRegion(x, y, z);
        if (!region) {
            region = this.addRegion(x, y, z);
        }
        let chunk = this.getChunk(x, y, z);
        if (!chunk) {
            chunk = this.addChunk(x, y, z);
        }
        const data = voxelPaletteGetFunctions[
        //@ts-ignore
        DVEW.engineSettings.settings.world?.voxelPaletteMode](voxelId, voxelStateId, region);
        if (data < 0)
            return;
        this._3dArray.setValueUseObj(this.worldBounds.getVoxelPosition(x, y, z), chunk.voxels, data);
        this.runRebuildCheck(x, y, z);
        let needLightUpdate = false;
        if (DVEW.engineSettings.settings.lighting?.autoRGBLight) {
            const voxel = DVEW.voxelManager.getVoxel(voxelId);
            if (voxel.lightSource && voxel.lightValue) {
                needLightUpdate = true;
                DVEW.queues.addToRGBUpdateQue(x, y, z);
            }
        }
        if (DVEW.engineSettings.settings.updating?.autoRebuild) {
            if (needLightUpdate) {
                DVEW.queues.runRGBUpdateQue();
                await DVEW.queues.awaitAllRGBLightUpdates();
            }
            DVEW.queues.runRebuildQue();
            await DVEW.queues.awaitAllChunksToBeBuilt();
        }
    },
    async requestVoxelBeRemoved(x, y, z) {
        const voxelCheck = this.getVoxel(x, y, z);
        if (!voxelCheck || voxelCheck[0] == -1)
            return;
        const voxel = voxelCheck[0];
        this.runRebuildCheck(x, y, z);
        let needLightUpdate = false;
        if (DVEW.engineSettings.settings.lighting?.autoRGBLight) {
            if (voxel.lightSource && voxel.lightValue) {
                DVEW.queues.addToRGBRemoveQue(x, y, z);
                needLightUpdate = true;
            }
        }
        if (DVEW.engineSettings.settings.updating?.autoRebuild) {
            if (needLightUpdate) {
                DVEW.queues.runRGBRemoveQue();
                await DVEW.queues.awaitAllRGBLightRemove();
            }
            this.setAir(x, y, z, 0);
            DVEW.queues.runRebuildQue();
            await DVEW.queues.awaitAllChunksToBeBuilt();
        }
    },
};
