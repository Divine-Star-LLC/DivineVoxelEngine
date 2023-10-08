import type { EngineSettingsData } from "Types/Data/Settings/EngineSettings.types";
import { EngineSettings } from "../../Data/Settings/EngineSettings.js";
import { ThreadComm } from "@divinestar/threads/";
import { DataLoaderThreadState } from "./DataLoaderThreadState.js";
import { DataHooks } from "../../Data/DataHooks.js";

export const ParentComm = ThreadComm.parent;
export const RichWorldComm = ThreadComm.createComm("rich-world");
export const WorldComm = ThreadComm.createComm("world");

ThreadComm.registerTasks<EngineSettingsData>("sync-settings", (settings) => {
 DataLoaderThreadState._settingsSynced = true;
 EngineSettings.syncSettings(settings);
 DataHooks.settingsSynced.run(settings);
});
