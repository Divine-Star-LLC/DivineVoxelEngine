//types
import type { DataHandler } from "Meta/Interfaces/DataLoader/DataHandler.type.js";
import type { EngineSettingsData } from "Meta/Data/Settings/EngineSettings.types.js";
//objects
import { EngineSettings } from "../Data/Settings/EngineSettings.js";
import { Util } from "../Global/Util.helper.js";
import { DataSyncNode } from "../Data/DataSyncNode.js";
import { DataManager } from "../Data/DataManager.js";
import { WorldDataSerialize } from "./Serializers/WorldDataSerializer.js";
//intercomms
import { WorldComm, ParentComm } from "./Threads/DataLoaderThreads.js";
//functions
import { InitWorker } from "./Init/InitWorker.js";
import { DataLoaderTasks } from "./Tasks/DataLoaderTasks.js";
import { DataHanlderWrapper } from "./DataHandler/DataHandlerWrapper.js";
import { ThreadComm } from "threadcomm";

export const DVEDL = {
 environment: <"node" | "browser">"browser",

 TC: ThreadComm,
 UTIL: Util,
 settings: EngineSettings,

 dataSyncNode: DataSyncNode,
 data: DataManager,

 worldComm: WorldComm,
 parentComm: ParentComm,

 tasks: DataLoaderTasks,

 serializer: WorldDataSerialize,

 dataHandler: DataHanlderWrapper,

 async $INIT(dataHanlder: DataHandler) {
  this.dataHandler.$INIT(dataHanlder);
  await InitWorker(this);
 },
};

export type DivineVoxelEngineData = typeof DVEDL;
