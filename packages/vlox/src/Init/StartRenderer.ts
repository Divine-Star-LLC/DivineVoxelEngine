import { DivineVoxelEngineRender, DVERInitData } from "../Contexts/Render";
import InitDataGenerator from "../Contexts/Base/Main/InitDataGenerator";
import { Threads, Thread, ThreadPool } from "@amodx/threads";
import InitWorldDataSync from "../Contexts/Base/Remote/InitWorldDataSync";
import InitRendererTasks from "../Renderer/InitTasks";
import InitMesher from "../Mesher/InitMesher";
import { InitVoxelDataProps } from "../Voxels/InitVoxelData";
import { MeshManager } from "../Renderer/MeshManager";
type StartRendererProps = {} & DVERInitData & InitVoxelDataProps;
export async function StartRenderer(initData: StartRendererProps) {
  const DVER = new DivineVoxelEngineRender();
  await Threads.init("render", window, "window");

  DivineVoxelEngineRender.initialized = true;
  DVER.renderer = initData.renderer;
  MeshManager.sectorMeshes = initData.renderer.sectorMeshes;
  if (initData.nexusWorker) {
    DVER.threads.nexus.setPort(initData.nexusWorker);
    DVER.threads.addThread(DVER.threads.nexus);
  }

  DVER.settings.syncSettings(<any>initData);

  if (!(initData.worldWorker instanceof Worker)) {
    throw Error(
      "Supplied data for World Worker is not correct. Must be path to worker or a worker."
    );
  }
  DVER.threads.setThreadPort(DVER.threads.world.name, initData.worldWorker);

  if (
    Array.isArray(initData.constructorWorkers) &&
    initData.constructorWorkers[0] instanceof Worker
  ) {
    DVER.threads.setThreadPort(
      DVER.threads.constructors.name,
      initData.constructorWorkers
    );
  } else {
    throw Error(
      "Supplied data for the Constructor Workers is not correct. Must be path to worker or an array workers."
    );
  }

  const syncData = InitDataGenerator({
    threads: {
      nexus: initData.nexusWorker ? true : false,
    },
    voxels: initData.voxels,
    substances: initData.substances || [],
    materials: initData.materials || [],
  });

  InitRendererTasks(DVER.threads.constructors);
  InitWorldDataSync();

  InitMesher(syncData.voxels.materials.palette, syncData.voxels.models);

  for (const thread of DVER.threads._threads) {
    if (thread.name == "window" || thread.name == "world") continue;
    if (thread instanceof ThreadPool) {
      for (const t of thread.getThreads()) {
        await t.waitTillTaskExist("sync-data");
        DVER.threads.world.connectToThread(t);
        await t.runTaskAsync("sync-data", syncData);
      }
    }
    if (thread instanceof Thread) {
      await thread.waitTillTaskExist("sync-data");
      DVER.threads.world.connectToThread(thread);
      await thread.runTaskAsync("sync-data", syncData);
    }
  }
  await DVER.threads.world.waitTillTaskExist("sync-data");
  await DVER.threads.world.runTaskAsync("sync-data", syncData);
  await DVER.renderer.init(DVER);

  return DVER;
}
