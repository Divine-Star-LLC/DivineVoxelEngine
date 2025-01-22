//objects
import { EngineSettings } from "../../Settings/EngineSettings.js";
import { RenderTasks } from "./Tasks/RenderTasks.js";
import { Threads } from "@amodx/threads/";

//functions

import type { EngineSettingsData } from "../../Settings/EngineSettings.types.js";
import type { RecursivePartial } from "../../Util/Util.types.js";
import { DVERenderer } from "../../Interfaces/Render/DVERenderer.js";
import { MeshManager } from "./Scene/MeshManager.js";
import { MeshRegister } from "./Scene/MeshRegister.js";

import { DVERenderThreads } from "./DVERenderThreads.js";

type PartialEngineSettings = RecursivePartial<EngineSettingsData>;
export interface DVERInitData extends PartialEngineSettings {
  worldWorker: Worker;
  constructorWorkers: Worker[];
  renderer: DVERenderer;
  nexusWorker?: Worker;
}

export class DivineVoxelEngineRender {
  static instance: DivineVoxelEngineRender;
  static initialized = false;
  TC = Threads;

  settings = EngineSettings;
  meshManager = MeshManager;
  meshRegister = MeshRegister;

  renderer: DVERenderer;

  tasks = RenderTasks;

  threads = new DVERenderThreads();

  constructor() {
    if (DivineVoxelEngineRender.instance)
      return DivineVoxelEngineRender.instance;
    DivineVoxelEngineRender.instance = this;
  }

  /**# clearAll
   *---
   * Clear all world data and meshes.
   */
  async clearAll() {
    this.meshRegister.clearAll();
    await this.threads.world.runAsyncTasks("clear-all", "", []);

    await Promise.all(
      this.threads.construcotrs
        .getThreads()
        .map((_) => _.runAsyncTasks("clear-all", ""))
    );
  }
}
