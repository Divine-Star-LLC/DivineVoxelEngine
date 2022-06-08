import {
 SetUpEngine,
 SetUpCanvas,
 SetUpDarkScene,
 SetUpDefaultCamera,
 SetUpDefaultSkybox,
 runRenderLoop,
 SetUpDefaultScene,
 CreateWorldAxis,
} from "../Shared/Babylon/index.js";
import { RunInit, SetUpWorkers } from "../Shared/Create/index.js";
import { DVER } from "../../out/Render/DivineVoxelEngineRender.js";
import { RegisterTexutres } from "../Shared/Functions/RegisterTextures.js";

RegisterTexutres(DVER);

const workers = SetUpWorkers(
   import.meta.url,
   "./World/world.js",
   "../Shared/Builder/builder.js",
   "../Shared/Propagators/propagators.js",
   "../Shared/Constructor/constructor.js"
  );
  
  await DVER.$INIT({
   worldWorker: workers.worldWorker,
   builderWorker: workers.builderWorkers,
   propagationWorker: workers.propagationWorkers,
   constructorWorker : workers.constructorWorkers,
 lighting: {
    doAO: true,
    doRGBLight: true,
    doSunLight: false,
    autoRGBLight: true,
    autoSunLight: false,
   },
});

const init = async () => {
 const canvas = SetUpCanvas();
 const engine = SetUpEngine(canvas);
 const scene = SetUpDarkScene(engine);
 const camera = SetUpDefaultCamera(
  scene,
  canvas,
  { x: -32, y: 16, z: 16 },
  { x: -32, y: 16, z: 0 }
 );
 SetUpDefaultSkybox(scene);
 CreateWorldAxis(scene, 20);
 await DVER.$SCENEINIT({ scene: scene });

 runRenderLoop(engine, scene, camera, DVER);
};

(window as any).DVER = DVER;
RunInit(init);
