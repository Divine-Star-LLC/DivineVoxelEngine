import type { EntityObject } from "Meta/Physics/Entity.type.js";
import type { ColliderObject } from "Meta/Physics/Collider.type.js";
import { EntityBase } from "./Entities/Entity.base.js";
export declare const DVEPH: {
    math: {
        visitAll: (startPoint: import("../Meta/Util.types.js").Position3Matrix, endPoint: import("../Meta/Util.types.js").Position3Matrix, visitor?: (x: number, y: number, z: number) => boolean) => number[];
        getVector3(x: number, y: number, z: number): import("../Math/Classes/Vector3.js").Vector3;
        getPlane(pv1: import("../Math/Classes/Vector3.js").Vector3, pv2: import("../Math/Classes/Vector3.js").Vector3, pv3: import("../Math/Classes/Vector3.js").Vector3, pv4: import("../Math/Classes/Vector3.js").Vector3): import("../Math/Classes/Plane.js").Plane;
        getSimpleBoundingBox(origin: import("../Math/Classes/Vector3.js").Vector3, dimensions: import("../Math/Types/Math.types.js").DimensionsVector3): import("../Math/Classes/SimpleBoundingBox.js").SimpleBoundingBox;
        getBoundingBox(data: import("../Math/Classes/BoundingBox.js").BoundingBoxData): import("../Math/Classes/BoundingBox.js").BoundingBox;
        convertToOriginGridSpace(position: number[]): number[];
    };
    collisions: {
        sweepAABB(ax: number, ay: number, az: number, ahx: number, ahy: number, ahz: number, bx: number, by: number, bz: number, bhx: number, bhy: number, bhz: number, dx: number, dy: number, dz: number): {
            h: number;
            nx: number;
            ny: number;
            nz: number;
        };
        lineToPlane(px: number, py: number, pz: number, ux: number, uy: number, uz: number, vx: number, vy: number, vz: number, nx: number, ny: number, nz: number): number;
        between(x: number, a: number, b: number): boolean;
    };
    colliders: {
        colliders: Record<string, ColliderObject>;
        registerCollider(collider: ColliderObject): void;
        getCollider(id: string): ColliderObject;
    };
    worldMatrix: {
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
            getValueUseObj(position: import("../Meta/Util.types.js").Position3Matrix, array: Uint32Array): number;
            getValueUseObjSafe(position: import("../Meta/Util.types.js").Position3Matrix, array: Uint32Array): number;
            setValue(x: number, y: number, z: number, array: Uint32Array, value: number): void;
            setValueUseObj(position: import("../Meta/Util.types.js").Position3Matrix, array: Uint32Array, value: number): void;
            setValueUseObjSafe(position: import("../Meta/Util.types.js").Position3Matrix, array: Uint32Array, value: number): void;
            deleteValue(x: number, y: number, z: number, array: Uint32Array): void;
            deleteUseObj(position: import("../Meta/Util.types.js").Position3Matrix, array: Uint32Array): void;
            getIndex(x: number, y: number, z: number): number;
            getXYZ(index: number): import("../Meta/Util.types.js").Position3Matrix;
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
            getChunkKey(chunkPOS: import("../Meta/Util.types.js").Position3Matrix): string;
            getChunkKeyFromPosition(x: number, y: number, z: number): string;
            getRegionKey(regionPOS: import("../Meta/Util.types.js").Position3Matrix): string;
            getRegionKeyFromPosition(x: number, y: number, z: number): string;
            getVoxelPositionFromChunkPosition(x: number, y: number, z: number, chunkPOS: import("../Meta/Util.types.js").Position3Matrix): {
                x: number;
                y: number;
                z: number;
            };
            getVoxelPosition(x: number, y: number, z: number): {
                x: number;
                y: number;
                z: number;
            };
            getWorldColumnKeyFromObj(position: import("../Meta/Util.types.js").Position3Matrix): string;
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
                getValueUseObj(position: import("../Meta/Util.types.js").Position3Matrix, array: Uint32Array): number;
                getValueUseObjSafe(position: import("../Meta/Util.types.js").Position3Matrix, array: Uint32Array): number;
                setValue(x: number, y: number, z: number, array: Uint32Array, value: number): void;
                setValueUseObj(position: import("../Meta/Util.types.js").Position3Matrix, array: Uint32Array, value: number): void;
                setValueUseObjSafe(position: import("../Meta/Util.types.js").Position3Matrix, array: Uint32Array, value: number): void;
                deleteValue(x: number, y: number, z: number, array: Uint32Array): void;
                deleteUseObj(position: import("../Meta/Util.types.js").Position3Matrix, array: Uint32Array): void;
                getIndex(x: number, y: number, z: number): number;
                getXYZ(index: number): import("../Meta/Util.types.js").Position3Matrix;
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
                setPositionUseObj(positionObj: import("../Meta/Util.types.js").Position3Matrix): number;
            };
            _getHeightMapData: Record<import("../Meta/index.js").VoxelTemplateSubstanceType, (byteData: number) => number>;
            _setHeightMapData: Record<import("../Meta/index.js").VoxelTemplateSubstanceType, (height: number, byteData: number) => number>;
            _markSubstanceAsNotExposed: Record<import("../Meta/index.js").VoxelTemplateSubstanceType, (data: number) => number>;
            _markSubstanceAsExposed: Record<import("../Meta/index.js").VoxelTemplateSubstanceType, (data: number) => number>;
            _isSubstanceExposed: Record<import("../Meta/index.js").VoxelTemplateSubstanceType, (data: number) => boolean>;
            getStartingHeightMapValue(): number;
            updateChunkMinMax(voxelPOS: import("../Meta/Util.types.js").Position3Matrix, minMax: Uint32Array): void;
            getChunkMin(minMax: Uint32Array): number;
            getChunkMax(minMax: Uint32Array): number;
            calculateHeightRemoveDataForSubstance(height: number, substance: import("../Meta/index.js").VoxelTemplateSubstanceType, x: number, z: number, heightMap: Uint32Array): boolean | undefined;
            calculateHeightAddDataForSubstance(height: number, substance: import("../Meta/index.js").VoxelTemplateSubstanceType, x: number, z: number, heightMap: Uint32Array): void;
            getLowestExposedVoxel(x: number, z: number, heightMap: Uint32Array): number;
            getHighestExposedVoxel(x: number, z: number, heightMap: Uint32Array): number;
            isSubstanceExposed(substance: import("../Meta/index.js").VoxelTemplateSubstanceType, x: number, z: number, heightMap: Uint32Array): boolean;
            markSubstanceAsExposed(substance: import("../Meta/index.js").VoxelTemplateSubstanceType, x: number, z: number, heightMap: Uint32Array): void;
            markSubstanceAsNotExposed(substance: import("../Meta/index.js").VoxelTemplateSubstanceType, x: number, z: number, heightMap: Uint32Array): void;
            setMinYForSubstance(height: number, substance: import("../Meta/index.js").VoxelTemplateSubstanceType, x: number, z: number, heightMap: Uint32Array): void;
            getMinYForSubstance(substance: import("../Meta/index.js").VoxelTemplateSubstanceType, x: number, z: number, heightMap: Uint32Array): number;
            setMaxYForSubstance(height: number, substance: import("../Meta/index.js").VoxelTemplateSubstanceType, x: number, z: number, heightMap: Uint32Array): void;
            getMaxYForSubstance(substance: import("../Meta/index.js").VoxelTemplateSubstanceType, x: number, z: number, heightMap: Uint32Array): number;
        };
        updateDieTime: number;
        loadDieTime: number;
        regions: import("../Meta/Matrix/Matrix.types.js").MatrixLoadedRegion;
        chunks: Record<string, Uint32Array>;
        chunkStates: Record<string, Uint8Array>;
        paletteMode: number;
        globalVoxelPalette: Record<number, string>;
        globalVoxelPaletteRecord: Record<string, string[]>;
        globalVoxelPaletteMap: Record<string, number>;
        voxelManager: import("../Meta/Voxels/VoxelManager.types.js").VoxelManagerInterface | null;
        lightValueFunctions: {
            r: (value: number) => number;
            g: (value: number) => number;
            b: (value: number) => number;
            s: (value: number) => number;
        };
        threadName: string;
        setVoxelManager(voxelManager: import("../Meta/Voxels/VoxelManager.types.js").VoxelManagerInterface): void;
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
        __handleHeightMapUpdateForVoxelAdd(voxelPOS: import("../Meta/Util.types.js").Position3Matrix, voxelData: import("../Meta/index.js").VoxelData, chunk: import("../Meta/Matrix/Matrix.types.js").MatrixLoadedChunk): void;
        getVoxelPaletteNumberId(voxelId: string, voxelStateId: string): number;
        getVoxelData(x: number, y: number, z: number, secondary?: boolean): false | import("../Meta/index.js").VoxelData;
        _createRegion(x: number, y: number, z: number): {
            chunks: {};
        };
        __setChunk(x: number, y: number, z: number, voxelsSAB: SharedArrayBuffer, voxelStatesSAB: SharedArrayBuffer, heightMapSAB: SharedArrayBuffer, minMaxMapSAB: SharedArrayBuffer, chunkStateSAB: SharedArrayBuffer): void;
        getRegion(x: number, y: number, z: number): false | {
            palette?: import("../Meta/World/WorldData/World.types.js").WorldRegionPalette | undefined;
            chunks: Record<string, Record<string, import("../Meta/Matrix/Matrix.types.js").MatrixLoadedChunk>>;
        };
        __removeChunk(x: number, y: number, z: number): false | undefined;
        getChunk(x: number, y: number, z: number): false | import("../Meta/Matrix/Matrix.types.js").MatrixLoadedChunk;
        getWorldColumn(x: number, z: number): false | Record<string, import("../Meta/Matrix/Matrix.types.js").MatrixLoadedChunk>;
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
    $INIT(): void;
    getCollider(x: number, y: number, z: number): false | ColliderObject;
    createEntityObject<T>(base: T): T & {
        active: boolean;
        position: import("../Math/Classes/Vector3.js").Vector3;
        direction: import("../Math/Classes/Vector3.js").Vector3;
        previousPosiiton: import("../Math/Classes/Vector3.js").Vector3;
        hitBox: {
            w: number;
            h: number;
            d: number;
        };
        speed: number;
        velocity: import("../Math/Classes/Vector3.js").Vector3;
        onGround: boolean;
        veloctiy: import("../Math/Classes/Vector3.js").Vector3;
        boundingBox: {
            w: number;
            h: number;
            d: number;
        };
        doCollision(x: number, y: number, z: number, colliderName: string, collisionData: {
            h: number;
            nx: number;
            ny: number;
            nz: number;
        }): void;
        setPosition(x: number, y: number, z: number): void;
        syncPosition(position: Float32Array): void;
        cachePosition(): void;
        setVelocity(x: number, y: number, z: number): void;
        applyVelocity(): void;
        beforeUpdate(): void;
        afterUpdate(): void;
        update(): void;
    } & EntityObject;
};
export declare type DivineVoxelEnginePhysics = typeof DVEPH;
