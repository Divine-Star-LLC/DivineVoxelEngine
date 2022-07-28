import type { VoxelSubstanceType } from "Meta/index.js";
export declare const DVEP: {
    illumination: {
        lightByte: {
            SRS: number;
            _lightValues: number[];
            getS(value: number): number;
            getR(value: number): number;
            getG(value: number): number;
            getB(value: number): number;
            setS(value: number, sl: number): number;
            setR(value: number, sl: number): number;
            setG(value: number, sl: number): number;
            setB(value: number, sl: number): number;
            removeS(sl: number): number;
            hasRGBLight(sl: number): boolean;
            getRGB(sl: number): number;
            setRGB(value: number, sl: number): number;
            decodeLightFromVoxelData(voxelData: number): number;
            encodeLightIntoVoxelData(voxelData: number, encodedLight: number): number;
            setLightValues(values: number[]): number;
            getLightValues(value: number): number[];
            isLessThanForRGBRemove(n1: number, n2: number): boolean;
            isLessThanForRGBAdd(n1: number, n2: number): boolean;
            isGreaterOrEqualThanForRGBRemove(n1: number, n2: number): boolean;
            getMinusOneForRGB(sl: number, nl: number): number;
            removeRGBLight(sl: number): number;
            getFullSunLight(sl: number): number;
            isLessThanForSunAdd(n1: number, n2: number): boolean;
            isLessThanForSunAddDown(n1: number, n2: number): boolean;
            isLessThanForSunAddUp(n1: number, n2: number): boolean;
            getSunLightForUnderVoxel(sl: number, nl: number): number;
            getMinusOneForSun(sl: number, nl: number): number;
            isLessThanForSunRemove(n1: number, sl: number): boolean;
            isGreaterOrEqualThanForSunRemove(n1: number, sl: number): boolean;
            sunLightCompareForDownSunRemove(n1: number, sl: number): boolean;
            removeSunLight(sl: number): number;
        };
        air: number[];
        runSunLightUpdateAt: typeof import("./Illumanation/Functions/SunLight.js").runSunLightUpdateAt;
        runSunLightUpdate: typeof import("./Illumanation/Functions/SunLight.js").runSunLightUpdate;
        runSunLightRemove: typeof import("./Illumanation/Functions/SunLight.js").runSunLightRemove;
        runSunLightRemoveAt: typeof import("./Illumanation/Functions/SunLight.js").runSunLightRemoveAt;
        populateWorldColumnWithSunLight: typeof import("./Illumanation/Functions/SunLight.js").PopulateWorldColumnWithSunLight;
        runSunLightUpdateAtMaxY: typeof import("./Illumanation/Functions/SunLight.js").RunSunLightUpdateAtMaxY;
        runSunLightFloodDown: typeof import("./Illumanation/Functions/SunLight.js").RunSunLightFloodDown;
        runSunLightFloodOut: typeof import("./Illumanation/Functions/SunLight.js").RunSunLightFloodOut;
        sunLightAboveCheck: typeof import("./Illumanation/Functions/SunLight.js").SunLightAboveCheck;
        _sunLightUpdateQue: number[][];
        _sunLightFloodDownQue: number[][];
        _sunLightFloodOutQue: Record<string, number[][]>;
        _sunLightRemoveQue: number[][];
        runRGBFloodFillAt: typeof import("./Illumanation/Functions/RGBFloodLight.js").runRGBFloodFillAt;
        runRGBFloodFill: typeof import("./Illumanation/Functions/RGBFloodLight.js").runRGBFloodFill;
        runRGBFloodRemoveAt: typeof import("./Illumanation/Functions/RGBFloodLight.js").runRGBFloodRemoveAt;
        runRGBFloodRemove: typeof import("./Illumanation/Functions/RGBFloodLight.js").runRGBFloodRemove;
        _RGBlightUpdateQue: number[][];
        _RGBlightRemovalQue: number[][];
        _visitMap: Record<string, boolean>;
    };
    flow: {
        currentVoxel: string;
        worldMatrx: {
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
                getValue(x: number, y: number, z: number, array: Uint32Array): number;
                getValueUseObj(position: import("Meta/index.js").Position3Matrix, array: Uint32Array): number;
                getValueUseObjSafe(position: import("Meta/index.js").Position3Matrix, array: Uint32Array): number;
                setValue(x: number, y: number, z: number, array: Uint32Array, value: number): void;
                setValueUseObj(position: import("Meta/index.js").Position3Matrix, array: Uint32Array, value: number): void;
                setValueUseObjSafe(position: import("Meta/index.js").Position3Matrix, array: Uint32Array, value: number): void;
                deleteValue(x: number, y: number, z: number, array: Uint32Array): void;
                deleteUseObj(position: import("Meta/index.js").Position3Matrix, array: Uint32Array): void;
                getIndex(x: number, y: number, z: number): number;
                getXYZ(index: number): import("Meta/index.js").Position3Matrix;
            };
            worldBounds: {
                __maxChunkYSize: number;
                bounds: {
                    MinZ: number;
                    MaxZ: number;
                    MinX: number;
                    MaxX: number;
                    MinY: number;
                    MaxY: number;
                };
                chunkXPow2: number;
                chunkYPow2: number;
                chunkZPow2: number;
                chunkXSize: number;
                chunkYSize: number;
                chunkZSize: number;
                chunkTotalVoxels: number;
                chunkArea: number;
                regionXPow2: number;
                regionYPow2: number;
                regionZPow2: number;
                regionXSize: number;
                regionYSize: number;
                regionZSize: number;
                __regionPosition: {
                    x: number;
                    y: number;
                    z: number;
                };
                __worldColumnPosition: {
                    x: number;
                    z: number;
                };
                __chunkPosition: {
                    x: number;
                    y: number;
                    z: number;
                };
                __voxelPosition: {
                    x: number;
                    y: number;
                    z: number;
                };
                syncBoundsWithArrays(): void;
                setWorldBounds(minX: number, maxX: number, minZ: number, maxZ: number, minY: number, maxY: number): void;
                isPositonOutsideOfBounds(x: number, y: number, z: number): boolean;
                isPositonInBounds(x: number, y: number, z: number): boolean;
                setChunkBounds(pow2X: number, pow2Y: number, pow2Z: number): void;
                setRegionBounds(pow2X: number, pow2Y: number, pow2Z: number): void;
                getRegionPosition(x: number, y: number, z: number): {
                    x: number;
                    y: number;
                    z: number;
                };
                getChunkPosition(x: number, y: number, z: number): {
                    x: number;
                    y: number;
                    z: number;
                };
                getChunkKey(chunkPOS: import("Meta/index.js").Position3Matrix): string;
                getChunkKeyFromPosition(x: number, y: number, z: number): string;
                getRegionKey(regionPOS: import("Meta/index.js").Position3Matrix): string;
                getRegionKeyFromPosition(x: number, y: number, z: number): string;
                getVoxelPositionFromChunkPosition(x: number, y: number, z: number, chunkPOS: import("Meta/index.js").Position3Matrix): {
                    x: number;
                    y: number;
                    z: number;
                };
                getVoxelPosition(x: number, y: number, z: number): {
                    x: number;
                    y: number;
                    z: number;
                };
                getWorldColumnKeyFromObj(position: import("Meta/index.js").Position3Matrix): string;
                getWorldColumnKey(x: number, z: number): string;
                getWorldColumnPosition(x: number, z: number): {
                    x: number;
                    z: number;
                };
            };
            voxelByte: {
                setId(id: number, value: number): number;
                getId(value: number): number;
                decodeLightFromVoxelData(voxelData: number): number;
                encodeLightIntoVoxelData(voxelData: number, encodedLight: number): number;
                decodeLevelFromVoxelData(stateData: number): number;
                encodeLevelIntoVoxelData(stateData: number, level: number): number;
                decodeLevelStateFromVoxelData(stateData: number): number;
                encodeLevelStateIntoVoxelData(stateData: number, levelState: number): number;
                getShapeState(voxelData: number): number;
                setShapeState(voxelData: number, shapeState: number): number;
            };
            lightByte: {
                SRS: number;
                _lightValues: number[];
                getS(value: number): number;
                getR(value: number): number;
                getG(value: number): number;
                getB(value: number): number;
                setS(value: number, sl: number): number;
                setR(value: number, sl: number): number;
                setG(value: number, sl: number): number;
                setB(value: number, sl: number): number;
                removeS(sl: number): number;
                hasRGBLight(sl: number): boolean;
                getRGB(sl: number): number;
                setRGB(value: number, sl: number): number;
                decodeLightFromVoxelData(voxelData: number): number;
                encodeLightIntoVoxelData(voxelData: number, encodedLight: number): number;
                setLightValues(values: number[]): number;
                getLightValues(value: number): number[];
                isLessThanForRGBRemove(n1: number, n2: number): boolean;
                isLessThanForRGBAdd(n1: number, n2: number): boolean;
                isGreaterOrEqualThanForRGBRemove(n1: number, n2: number): boolean;
                getMinusOneForRGB(sl: number, nl: number): number;
                removeRGBLight(sl: number): number;
                getFullSunLight(sl: number): number;
                isLessThanForSunAdd(n1: number, n2: number): boolean;
                isLessThanForSunAddDown(n1: number, n2: number): boolean;
                isLessThanForSunAddUp(n1: number, n2: number): boolean;
                getSunLightForUnderVoxel(sl: number, nl: number): number;
                getMinusOneForSun(sl: number, nl: number): number;
                isLessThanForSunRemove(n1: number, sl: number): boolean;
                isGreaterOrEqualThanForSunRemove(n1: number, sl: number): boolean;
                sunLightCompareForDownSunRemove(n1: number, sl: number): boolean;
                removeSunLight(sl: number): number;
            };
            heightByte: {
                heightMapArray: {
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
                    getValue(x: number, y: number, z: number, array: Uint32Array): number;
                    getValueUseObj(position: import("Meta/index.js").Position3Matrix, array: Uint32Array): number;
                    getValueUseObjSafe(position: import("Meta/index.js").Position3Matrix, array: Uint32Array): number;
                    setValue(x: number, y: number, z: number, array: Uint32Array, value: number): void;
                    setValueUseObj(position: import("Meta/index.js").Position3Matrix, array: Uint32Array, value: number): void;
                    setValueUseObjSafe(position: import("Meta/index.js").Position3Matrix, array: Uint32Array, value: number): void;
                    deleteValue(x: number, y: number, z: number, array: Uint32Array): void;
                    deleteUseObj(position: import("Meta/index.js").Position3Matrix, array: Uint32Array): void;
                    getIndex(x: number, y: number, z: number): number;
                    getXYZ(index: number): import("Meta/index.js").Position3Matrix;
                };
                positionByte: {
                    _poisiton: {
                        x: number;
                        y: number;
                        z: number;
                    };
                    _positionMasks: {
                        x: number;
                        z: number;
                        y: number;
                    };
                    getY(byteData: number): number;
                    getPosition(byteData: number): {
                        x: number;
                        y: number;
                        z: number;
                    };
                    setPosition(x: number, y: number, z: number): number;
                    setPositionUseObj(positionObj: import("Meta/index.js").Position3Matrix): number;
                };
                _getHeightMapData: Record<import("Meta/index.js").VoxelTemplateSubstanceType, (byteData: number) => number>;
                _setHeightMapData: Record<import("Meta/index.js").VoxelTemplateSubstanceType, (height: number, byteData: number) => number>;
                _markSubstanceAsNotExposed: Record<import("Meta/index.js").VoxelTemplateSubstanceType, (data: number) => number>;
                _markSubstanceAsExposed: Record<import("Meta/index.js").VoxelTemplateSubstanceType, (data: number) => number>;
                _isSubstanceExposed: Record<import("Meta/index.js").VoxelTemplateSubstanceType, (data: number) => boolean>;
                getStartingHeightMapValue(): number;
                updateChunkMinMax(voxelPOS: import("Meta/index.js").Position3Matrix, minMax: Uint32Array): void;
                getChunkMin(minMax: Uint32Array): number;
                getChunkMax(minMax: Uint32Array): number;
                calculateHeightRemoveDataForSubstance(height: number, substance: import("Meta/index.js").VoxelTemplateSubstanceType, x: number, z: number, heightMap: Uint32Array): boolean | undefined;
                calculateHeightAddDataForSubstance(height: number, substance: import("Meta/index.js").VoxelTemplateSubstanceType, x: number, z: number, heightMap: Uint32Array): void;
                getLowestExposedVoxel(x: number, z: number, heightMap: Uint32Array): number;
                getHighestExposedVoxel(x: number, z: number, heightMap: Uint32Array): number;
                isSubstanceExposed(substance: import("Meta/index.js").VoxelTemplateSubstanceType, x: number, z: number, heightMap: Uint32Array): boolean;
                markSubstanceAsExposed(substance: import("Meta/index.js").VoxelTemplateSubstanceType, x: number, z: number, heightMap: Uint32Array): void;
                markSubstanceAsNotExposed(substance: import("Meta/index.js").VoxelTemplateSubstanceType, x: number, z: number, heightMap: Uint32Array): void;
                setMinYForSubstance(height: number, substance: import("Meta/index.js").VoxelTemplateSubstanceType, x: number, z: number, heightMap: Uint32Array): void;
                getMinYForSubstance(substance: import("Meta/index.js").VoxelTemplateSubstanceType, x: number, z: number, heightMap: Uint32Array): number;
                setMaxYForSubstance(height: number, substance: import("Meta/index.js").VoxelTemplateSubstanceType, x: number, z: number, heightMap: Uint32Array): void;
                getMaxYForSubstance(substance: import("Meta/index.js").VoxelTemplateSubstanceType, x: number, z: number, heightMap: Uint32Array): number;
            };
            updateDieTime: number;
            loadDieTime: number;
            regions: import("../../Meta/Matrix/Matrix.types.js").MatrixLoadedRegion;
            chunks: Record<string, Uint32Array>;
            chunkStates: Record<string, Uint8Array>;
            paletteMode: number;
            globalVoxelPalette: Record<number, string>;
            globalVoxelPaletteRecord: Record<string, string[]>;
            globalVoxelPaletteMap: Record<string, number>;
            voxelManager: import("../../Meta/Voxels/VoxelManager.types.js").VoxelManagerInterface | null;
            lightValueFunctions: {
                r: (value: number) => number;
                g: (value: number) => number;
                b: (value: number) => number;
                s: (value: number) => number;
            };
            threadName: string;
            setVoxelManager(voxelManager: import("../../Meta/Voxels/VoxelManager.types.js").VoxelManagerInterface): void;
            syncChunkBounds(): void;
            getVoxelPalette(voxelId: string, voxelState: string): number;
            awaitChunkLoad(x: number, y: number, z: number, timeout?: number): Promise<boolean>;
            __setGlobalVoxelPalette(palette: Record<number, string>, record: Record<string, string[]>, map: Record<string, number>): void;
            getVoxel(x: number, y: number, z: number, secondary?: boolean): false | string[];
            getVoxelShapeState(x: number, y: number, z: number): number;
            getLevel(x: number, y: number, z: number): number;
            setLevel(level: number, x: number, y: number, z: number): void;
            getLevelState(x: number, y: number, z: number): number;
            setLevelState(state: number, x: number, y: number, z: number): void;
            setVoxel(voxelId: string, voxelStateId: string, shapeState: number, x: number, y: number, z: number): false | undefined;
            __handleHeightMapUpdateForVoxelAdd(voxelPOS: import("Meta/index.js").Position3Matrix, voxelData: import("Meta/index.js").VoxelData, chunk: import("../../Meta/Matrix/Matrix.types.js").MatrixLoadedChunk): void;
            getVoxelPaletteNumberId(voxelId: string, voxelStateId: string): number;
            getVoxelData(x: number, y: number, z: number, secondary?: boolean): false | import("Meta/index.js").VoxelData;
            _createRegion(x: number, y: number, z: number): {
                chunks: {};
            };
            __setChunk(x: number, y: number, z: number, voxelsSAB: SharedArrayBuffer, voxelStatesSAB: SharedArrayBuffer, heightMapSAB: SharedArrayBuffer, minMaxMapSAB: SharedArrayBuffer, chunkStateSAB: SharedArrayBuffer): void;
            getRegion(x: number, y: number, z: number): false | {
                palette?: import("../../Meta/World/WorldData/World.types.js").WorldRegionPalette | undefined;
                chunks: Record<string, Record<string, import("../../Meta/Matrix/Matrix.types.js").MatrixLoadedChunk>>;
            };
            __removeChunk(x: number, y: number, z: number): false | undefined;
            getChunk(x: number, y: number, z: number): false | import("../../Meta/Matrix/Matrix.types.js").MatrixLoadedChunk;
            getWorldColumn(x: number, z: number): false | Record<string, import("../../Meta/Matrix/Matrix.types.js").MatrixLoadedChunk>;
            isChunkLocked(x: number, y: number, z: number): boolean;
            lockChunk(x: number, y: number, z: number): boolean;
            unLockChunk(x: number, y: number, z: number): boolean;
            updateChunkData(x: number, y: number, z: number, run: (chunk: {
                voxels: Uint32Array;
                chunkStates: Uint8Array;
            }) => {}): false | Promise<boolean>;
            setData(x: number, y: number, z: number, data: number, state?: boolean): false | undefined;
            getData(x: number, y: number, z: number, state?: boolean): number;
            getVoxelNumberID(x: number, y: number, z: number, secondary?: boolean): number | false;
            getLight(x: number, y: number, z: number): number;
            setAir(x: number, y: number, z: number, lightValue: number): void;
            setFullSun(x: number, y: number, z: number): void;
            setLight(x: number, y: number, z: number, lightValue: number): void;
            getLightValue(x: number, y: number, z: number, type: "r" | "g" | "b" | "s"): number;
            sameVoxel(x: number, y: number, z: number, cx: number, cy: number, cz: number): boolean;
        };
        _visitedMap: Record<string, boolean>;
        _flowQue: number[][];
        _flowRemoveQue: number[][];
        runRemovePropagation: typeof import("./Flow/Functions/RunFlowRemove.js").RunRemovePropagation;
        runFlowReduce: typeof import("./Flow/Functions/RunFlowRemove.js").RunFlowReduce;
        runFlowRemove: typeof import("./Flow/Functions/RunFlowRemove.js").RunFlowRemove;
        runFlow: typeof import("./Flow/Functions/RunFlow.js").RunFlow;
        runFlowNoChunkRebuild: typeof import("./Flow/Functions/RunFlowNoChunkBuild.js").RunFlowNoChunkBuild;
        runFlowIncrease: typeof import("./Flow/Functions/RunFlow.js").RunFlowIncrease;
        runFlowPropagation: typeof import("./Flow/Functions/RunFlow.js").RunFlowPropagation;
        rebuildQue: number[][];
        rebuildMap: Record<string, boolean>;
        addToMap(x: number, y: number, z: number): void;
        inMap(x: number, y: number, z: number): boolean;
        setVoxel(level: number, levelState: number, x: number, y: number, z: number): void;
        runRemoveCheck(x: number, y: number, z: number): void;
        setCurrentVoxel(x: number, y: number, z: number): boolean;
        runRebuildQue(): void;
        __addToRebuildQue(x: number, y: number, z: number): void;
        addToRebuildQue(x: number, y: number, z: number, sync?: boolean): void;
        setLevel(level: number, x: number, y: number, z: number): void;
        removeVoxel(x: number, y: number, z: number): void;
        getLevel(x: number, y: number, z: number): number;
        getLevelState(x: number, y: number, z: number): number;
        canFlowOutwardTest(x: number, y: number, z: number): boolean;
        canFlowDownardTest(x: number, y: number, z: number): boolean;
        flowDownTest(x: number, y: number, z: number): boolean;
        wait(ms: number): Promise<unknown>;
    };
    rebuildQueMap: Record<string, boolean>;
    $INIT(): void;
    addToRebuildQue(x: number, y: number, z: number, substance: VoxelSubstanceType | "all"): void;
    runRebuildQue(): void;
    runRGBFloodFill(x: number, y: number, z: number): void;
    runRGBFloodRemove(x: number, y: number, z: number): void;
    runSunLightForWorldColumn(x: number, z: number, maxY: number): void;
    runSunFloodFillAtMaxY(x: number, z: number, maxY: number): void;
    runSunFloodFillMaxYFlood(x: number, z: number, maxY: number): void;
    runSunLightUpdate(x: number, y: number, z: number): void;
    runSunLightRemove(x: number, y: number, z: number): void;
    runFlowAt(x: number, y: number, z: number): Promise<void>;
    removeFlowAt(x: number, y: number, z: number): Promise<void>;
};
export declare type DivineVoxelEnginePropagation = typeof DVEP;
