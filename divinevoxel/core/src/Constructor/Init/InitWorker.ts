import { DivineVoxelEngineConstructor } from "../DivineVoxelEngineConstructor.js";
import type { EngineSettingsData } from "Types/Data/Settings/EngineSettings.types";
import { EngineSettings } from "../../Data/Settings/EngineSettings.js";
import { ConstructorThreadState } from "../Threads/ConstructorThreadState.js";
import { ThreadComm } from "@divinestar/threads/";
import { DataHooks } from "../../Data/DataHooks.js";
import { SubstanceRules } from "../Builder/Rules/SubstanceRules.js";

export async function InitWorker(DVEC: DivineVoxelEngineConstructor) {
  let parent = "render";
  if (DivineVoxelEngineConstructor.environment == "node") {
    parent = "server";
  }
  await ThreadComm.$INIT("constructor", parent);
  DVEC.builder.$INIT();

  ThreadComm.registerTasks<EngineSettingsData>("sync-settings", (settings) => {
    EngineSettings.syncSettings(settings);
    ConstructorThreadState._settingsSynced = true;
    DataHooks.settingsSynced.run(settings);
  });

  await DVEC.UTIL.createPromiseCheck({
    check: () => {
      return ConstructorThreadState.isReady();
    },
    onReady() {},
    checkInterval: 1,
  });
  ThreadComm.registerTasks("ready", () => {
    SubstanceRules.$BuildRules();
  });
}
