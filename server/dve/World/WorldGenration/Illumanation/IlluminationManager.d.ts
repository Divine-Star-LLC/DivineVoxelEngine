import type { ChunkData } from "Meta/index.js";
import { runRGBFloodFillAt, runRGBFloodRemove, runRGBFloodRemoveAt, runRGBFloodFill } from "./Functions/RGBFloodLight.js";
import { runSunLightRemove, runSunLightRemoveAt, runSunLightUpdate, runSunLightUpdateAt } from "./Functions/SunLight.js";
export declare const IlluminationManager: {
    lightByte: {
        getS(value: number): number;
        getR(value: number): number;
        getG(value: number): number;
        getB(value: number): number;
        decodeLightFromVoxelData(voxelData: number): number;
        encodeLightIntoVoxelData(voxelData: number, encodedLight: number): number;
        setLightValues(values: number[]): number;
        getLightValues(value: number): number[];
        isLessThanForRGBRemove(n1: number, n2: number): boolean;
        isLessThanForRGBAdd(n1: number, n2: number): boolean;
        isGreaterOrEqualThanForRGBRemove(n1: number, n2: number): boolean;
        getMinusOneForRGB(sl: number): number;
        removeRGBLight(sl: number): number;
        getFullSunLight(sl: number): number;
        isLessThanForSunAdd(n1: number, n2: number): boolean;
        isLessThanForSunAddDown(n1: number, n2: number): boolean;
        getSunLightForUnderVoxel(currentVoxel: number): number;
        getMinusOneForSun(sl: number): number;
        isLessThanForSunRemove(n1: number, sl: number): boolean;
        isGreaterOrEqualThanForSunRemove(n1: number, sl: number): boolean;
        sunLightCompareForDownSunRemove(n1: number, sl: number): boolean;
        removeSunLight(sl: number): number;
    };
    voxelByte: {
        setId(id: number, value: number): number;
        getId(value: number): number;
        decodeLightFromVoxelData(voxelData: number): number;
        encodeLightIntoVoxelData(voxelData: number, encodedLight: number): number;
    };
    _3dArray: {
        bounds: {
            x: number;
            y: number;
            z: number;
        };
        _position: {
            x: number;
            y: number;
            z: number;
        };
        setBounds(x: number, y: number, z: number): void;
        getValue(x: number, y: number, z: number, array: import("Meta/index.js").ChunkVoxels): number;
        setValue(x: number, y: number, z: number, array: import("Meta/index.js").ChunkVoxels, value: number): void;
        delete(x: number, y: number, z: number, array: import("Meta/index.js").ChunkVoxels): void;
        getIndex(x: number, y: number, z: number): number;
        getXYZ(index: number): import("Meta/index.js").PositionMatrix;
    };
    air: number[];
    runSunLightUpdateAt: typeof runSunLightUpdateAt;
    runSunLightUpdate: typeof runSunLightUpdate;
    runSunLightRemove: typeof runSunLightRemove;
    runSunLightRemoveAt: typeof runSunLightRemoveAt;
    runRGBFloodFillAt: typeof runRGBFloodFillAt;
    runRGBFloodFill: typeof runRGBFloodFill;
    runRGBFloodRemoveAt: typeof runRGBFloodRemoveAt;
    runRGBFloodRemove: typeof runRGBFloodRemove;
    _RGBlightUpdateQue: number[][];
    _RGBlightRemovalQue: number[][];
    _sunLightUpdateQue: number[][];
    _sunLightRemoveQue: number[][];
    syncChunkBounds(): void;
    addChunkToSunLightUpdate(chunk: ChunkData, chunkX: number, chunkY: number, chunkZ: number): void;
    populateChunkAirWithInitlSunLight(chunk: ChunkData): void;
};
