import { DVEW } from "../../../out/World/DivineVoxelEngineWorld.js";
import { RegisterVoxels } from "../../Shared/Functions/RegisterVoxelData.js";
import { WorldGen } from "./WorldGen/WorldGen.js";
RegisterVoxels(DVEW);
await DVEW.$INIT({
    onReady: () => { },
});
const topTest = async () => {
    let startX = -16;
    let startZ = -16;
    let endX = 16;
    let endZ = 16;
    for (let x = startX; x < endX; x += 16) {
        for (let z = startZ; z < endZ; z += 16) {
            WorldGen.generateChunk(x, 0, z, 0);
        }
    }
    await DVEW.worldData.requestVoxelAdd("dve:debugbox", "default", 0, 2, 0);
};
const southTest = async () => {
    let startX = -48;
    let startZ = -16;
    let endX = -16;
    let endZ = 16;
    for (let x = startX; x < endX; x += 16) {
        for (let z = startZ; z < endZ; z += 16) {
            WorldGen.generateChunk(x, 0, z, 1);
            console.log(x, 0, z);
            console.log(DVEW.worldData.getChunk(x, 0, z));
        }
    }
    await DVEW.worldData.requestVoxelAdd("dve:debugbox", "default", startX + 16, 8, -1);
    for (let x = startX; x < endX; x += 16) {
        for (let z = startZ; z < endZ; z += 16) {
            DVEW.buildChunk(x, 0, z);
        }
    }
};
topTest();
southTest();
self.DVEW = DVEW;
