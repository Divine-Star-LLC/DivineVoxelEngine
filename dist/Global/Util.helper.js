import { InfoByte } from "./Util/InfoByte.js";
import { LightByte } from "./Util/LightByte.js";
import { VoxelByte } from "./Util/VoxelByte.js";
import { Flat3DArray } from "./Util/Flat3DArray.js";
import { WorldBounds } from "./Util/WorldBounds.js";
import { GetWorkerPort } from "./Util/GetWorkerPort.js";
import { CreatePromiseCheck } from "./Util/CreatePromiseCheck.js";
import { FaceByte } from "./Util/FaceByte.js";
import { HeightByte } from "./Util/HeightByte.js";
export const Util = {
    createPromiseCheck: CreatePromiseCheck,
    getWorkerPort: GetWorkerPort,
    getEnviorment() {
        let environment = "browser";
        //@ts-ignore
        if (typeof process !== "undefined" && typeof Worker === "undefined") {
            environment = "node";
        }
        return environment;
    },
    getFlat3DArray() {
        return Flat3DArray;
    },
    getFaceByte() {
        return FaceByte;
    },
    getHeightByte() {
        return HeightByte;
    },
    getVoxelByte() {
        return VoxelByte;
    },
    getLightByte() {
        return LightByte;
    },
    getWorldBounds() {
        return WorldBounds;
    },
    getInfoByte(number = 0) {
        InfoByte.setNumberValue(number);
        return InfoByte;
    },
    degtoRad(degrees) {
        return degrees * (Math.PI / 180);
    },
    radToDeg(radians) {
        return radians * (180 / Math.PI);
    },
};
