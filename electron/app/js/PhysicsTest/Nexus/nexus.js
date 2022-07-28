import { RegisterVoxels } from "../../Shared/Functions/RegisterVoxelData.js";
import { DVEN } from "../../../out/Nexus/DivineVoxelEngineNexus.js";
import { Player } from "./Player.js";
import { DVEPH } from "../../../out/Physics/DivineVoxelEnginePhysics.js";
RegisterVoxels(DVEN);
await DVEN.$INIT({});
DVEPH.$INIT();
const playerPositionSAB = new SharedArrayBuffer(4 * 3);
const playerPosition = new Float32Array(playerPositionSAB);
DVEN.renderComm.sendMessage("connect-player-data", [playerPositionSAB]);
let playerDirection = new Float32Array();
let playerStates = new Uint8Array();
let ready = false;
DVEN.renderComm.listenForMessage("connect-player-states", (data) => {
    playerDirection = new Float32Array(data[1]);
    playerStates = new Uint8Array(data[2]);
    ready = true;
});
await DVEN.UTIL.createPromiseCheck({
    checkInterval: 1,
    check: () => ready,
});
Player.$INIT(playerStates, playerDirection, playerPosition);
setInterval(() => {
    Player.update();
}, 17);
