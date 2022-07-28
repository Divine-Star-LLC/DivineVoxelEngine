import { VoxelData } from "../../../../../out/Meta/index";

export const DebugBoxVoxelData: VoxelData = {
 name: "Debug Box",
 shapeId: "Box",
 id: "dve:debugbox",
 substance: "solid",
 lightSource: true,
 lightValue: 0b1111_1111_1111_0000,
 physics : {
    collider : "Box",
    checkCollisions : true
 }
};
