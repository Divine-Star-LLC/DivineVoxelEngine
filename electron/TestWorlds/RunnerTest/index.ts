import {
 SetUpEngine,
 SetUpCanvas,
 SetUpDefaultCamera,
 SetUpDefaultSkybox,
 runRenderLoop,
 SetUpDefaultScene,
} from "../Shared/Babylon/index.js";
import { RunInit } from "../Shared/Create/index.js";
import { DivineVoxelEngine } from "../../out/Core/DivineVoxelEngine.js";
import { Player } from "../Shared/Player/Type2/Player.js";
const DVE = new DivineVoxelEngine();
(window as any).DVE = DVE;

await DVE.$INIT({
 worldWorkerPath: "../../../js/RunnerTest/World/index.js",
 builderWorkerPath: "../../../js/Shared/Builder/builder.js",
 fluidBuilderWorkerPath: "../../../js/Shared/FluidBuilder/fluidbuilder.js",
});
const player = new Player(DVE);

const init = async () => {
 const canvas = SetUpCanvas();
 const engine = SetUpEngine(canvas);
 const scene = SetUpDefaultScene(engine);
 const camera = SetUpDefaultCamera(scene, canvas, { x: 0, y: 1, z: 0 });
 SetUpDefaultSkybox(scene);

 await DVE.$SCENEINIT({ scene: scene });


 player.createPlayerSharedArrays();
 player.createPlayer(scene, camera);
 (window as any).player = player;
 setInterval(() => {
  player.update();
 }, 10);

 runRenderLoop(engine, scene, player.hitbox);
};

RunInit(init);
