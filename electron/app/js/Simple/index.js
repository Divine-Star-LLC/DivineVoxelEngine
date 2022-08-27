import { SetUpEngine, SetUpCanvas, SetUpDefaultCamera, SetUpDefaultSkybox, runRenderLoop, SetUpDefaultScene, } from "../Shared/Babylon/index.js";
import { RunInit, SetUpWorkers } from "../Shared/Create/index.js";
import { DVER } from "../../out/Render/DivineVoxelEngineRender.js";
import { RegisterTexutres } from "../Shared/Functions/RegisterTextures.js";
RegisterTexutres(DVER);
const workers = SetUpWorkers(import.meta.url, "./World/world.js", "../Shared/Constructor/constructor.js", null, null, "./FX/fx.js");
await DVER.$INIT({
    worldWorker: workers.worldWorker,
    constructorWorker: workers.constructorWorkers,
    fxWorker: workers.fxWorker,
    fx: {
        enabled: true,
        autoSyncChunks: true,
    },
    chunks: {
        chunkYPow2: 4,
    },
    world: {
        maxY: 128
    },
    lighting: {
        doAO: true,
        doRGBLight: false,
        doSunLight: false,
        autoRGBLight: false,
        autoSunLight: false,
    },
});
const init = async () => {
    const canvas = SetUpCanvas();
    const engine = SetUpEngine(canvas);
    const scene = SetUpDefaultScene(engine);
    const camera = SetUpDefaultCamera(scene, canvas, { x: 2, y: 45, z: 7 }, { x: 10, y: 30, z: 10 });
    const box = SetUpDefaultSkybox(scene);
    const bmat = DVER.renderManager.createSkyBoxMaterial(scene);
    if (bmat) {
        box.material = bmat;
    }
    // CreateWorldAxis(scene, 36);
    await DVER.$SCENEINIT({ scene: scene });
    const hemLight = new BABYLON.HemisphericLight("", new BABYLON.Vector3(0, 1, 0), scene);
    DVER.renderManager.setBaseLevel(.8);
    DVER.renderManager.setSunLevel(0.8);
    const mat = new BABYLON.StandardMaterial("");
    mat.diffuseColor = new BABYLON.Color3(1, 0, 1);
    //mat.diffuseColor.b = 1;
    /*  const chunkMarker = BABYLON.MeshBuilder.CreateBox("", {
      width: 16,
      depth: 16,
      height: 128,
     });
     chunkMarker.material = mat;
     chunkMarker.visibility = 0.5;
     chunkMarker.position.x = 8;
     chunkMarker.position.z = 8;
     chunkMarker.position.y = 128 / 2; */
    //(DVER as any).renderManager.fluidMaterial.material.wireframe = true;
    runRenderLoop(engine, scene, camera, DVER);
};
window.DVER = DVER;
RunInit(init);
const voxelByte = DVER.UTIL.getVoxelByte();
