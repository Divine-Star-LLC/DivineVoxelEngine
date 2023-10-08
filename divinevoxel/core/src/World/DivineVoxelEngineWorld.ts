//type
import type { EngineSettingsData } from "Types/Data/Settings/EngineSettings.types.js";
//threads
import {
  ParentComm,
  NexusComm,
  RichWorldComm,
  DataComm,
  FXComm,
  CCM,
} from "./Threads/WorldThreads.js";
//queues
import { ConstructorQueues } from "../Common/Queues/ConstructorQueues.js";
//tasks
import { ConstructorTasks } from "../Common/Tasks/ConstructorTasks.js";
//objects
import { EngineSettings } from "../Data/Settings/EngineSettings.js";
import { Util } from "../Global/Util.helper.js";
//data
import { DataSync } from "./Data/DataSync.js";
import { DataManager } from "../Data/DataManager.js";
import {
  SubstanceManager,
  VoxelManager,
} from "./Data/Managers/DataManagers.js";
import { WorldDataGenerator } from "./Data/Generators/WorldDataGenerator.js";
//tags
import { VoxelTagBuilder } from "./Data/TagBuilders/VoxelTagBuilder.js";
//tools
import { BuilderTool } from "../Tools/Build/BuilderTool.js";
import { GetAdvancedBrushTool } from "../Tools/Brush/AdvancedBrushTool.js";
import { ChunkDataTool } from "../Tools/Data/WorldData/ChunkDataTool.js";
import { ColumnDataTool } from "../Tools/Data/WorldData/ColumnDataTool.js";
import { DataTool } from "../Tools/Data/DataTool.js";
import { TaskTool } from "../Tools/Tasks/TasksTool.js";
import { HeightMapTool } from "../Tools/Data/WorldData/HeightMapTool.js";
import { RegionDataTool } from "../Tools/Data/WorldData/RegionDataTool.js";
import { DataLoaderTool } from "../Tools/Loader/DataLoaderTool.js";
//functions
import { InitWorldWorker } from "./Init/InitWorldWorker.js";
import { Task, ThreadComm } from "@divinestar/threads/";
import { ChunkDataTags } from "./Data/Tags/ChunkTags.js";
import { WorldTasks } from "./Tasks/WorldTasks.js";
import { RichDataTool } from "../Tools/Data/RichDataTool.js";
import { SubstanceTagBuilder } from "./Data/TagBuilders/SubstanceTagBuilder.js";
/**# Divine Voxel Engine World
 * ---
 * This handles everything in the world worker context.
 */
export class DivineVoxelEngineWorld {
  static environment: "node" | "browser" = "browser";
  static instance: DivineVoxelEngineWorld;

  TC = ThreadComm;
  UTIL = Util;
  settings = EngineSettings;
  worldTasks = WorldTasks;
  generators = {
    worldData: WorldDataGenerator,
  };
  data = DataManager;
  dataSync = DataSync;

  fxComm = FXComm;
  dataComm = DataComm;
  nexusComm = NexusComm;
  parentComm = ParentComm;
  ccm = CCM;
  richWorldComm = RichWorldComm;

  cQueues = ConstructorQueues;
  cTasks = ConstructorTasks;

  dataRegister = {
    voxels: VoxelManager,
    substances: SubstanceManager,
  };

  tags = {
    voxels: VoxelTagBuilder,
    substances: SubstanceTagBuilder,
    chunks: ChunkDataTags,
  };

  constructor() {
    if (DivineVoxelEngineWorld.instance) return DivineVoxelEngineWorld.instance;
    DivineVoxelEngineWorld.instance = this;
  }

  async init() {
    await InitWorldWorker(this);
  }

  getAllTools() {
    return {
      brush: this.getBrush(),
      builder: this.getBuilder(),
      data: this.getDataTool(),
      chunkData: this.getChunkDataTool(),
      columnData: this.getColumnDataTool(),
      regonData: this.getRegionTool(),
      heightMap: this.getHeightMapTool(),
      tasks: this.getTasksTool(),
    };
  }

  getBrush() {
    return GetAdvancedBrushTool();
  }
  getBuilder() {
    return new BuilderTool();
  }
  getDataTool() {
    return new DataTool();
  }
  getRegionTool() {
    return new RegionDataTool();
  }
  getChunkDataTool() {
    return new ChunkDataTool();
  }
  getColumnDataTool() {
    return new ColumnDataTool();
  }
  getHeightMapTool() {
    return new HeightMapTool();
  }
  getTasksTool() {
    return new TaskTool();
  }
  getDataLoaderTool() {
    return new DataLoaderTool();
  }
  getRichDataTool() {
    return new RichDataTool();
  }
}

DivineVoxelEngineWorld.environment = Util.getEnviorment();
ThreadComm.threadName = "world";
