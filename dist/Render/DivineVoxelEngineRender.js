//types
import { DVEBabylon } from "./Babylon/DVEBabylon.js";
//objects
import { Util } from "../Global/Util.helper.js";
import { TextureManager } from "./Textures/TextureManager.js";
import { EngineSettings } from "../Data/Settings/EngineSettings.js";
import { MeshManager } from "./Scene/MeshManager.js";
import { RenderManager } from "./Render/RenderManager.js";
import { RenderTasks } from "./Tasks/RenderTasks.js";
import { WorldBounds } from "../Data/World/WorldBounds.js";
import { ThreadComm } from "threadcomm";
import { WorldSpaces } from "../Data/World/WorldSpaces.js";
import { SceneTool } from "./Tools/SceneTool.js";
//inter comms
import { DataComm } from "./Threads/Data/DataComm.js";
import { FXComm } from "./Threads/FX/FXComm.js";
import { NexusComm } from "./Threads/Nexus/NexusComm.js";
import { WorldComm } from "./Threads/World/WorldComm.js";
import { ConstructorCommManager } from "./Threads/Constructor/ConstructorCommManager.js";
import { RichWorldComm } from "./Threads/RichWorld/RichWorldComm.js";
//functions
import { InitWorkers } from "./Init/InitThreads.js";
import { $INITFunction } from "./Init/InitRender.js";
export const DVER = {
    UTIL: Util,
    TC: ThreadComm,
    currentCom: ThreadComm.parent,
    worldComm: WorldComm,
    nexusComm: NexusComm,
    dataComm: DataComm,
    fxComm: FXComm,
    richWorldComm: RichWorldComm,
    constructorCommManager: ConstructorCommManager,
    babylon: DVEBabylon,
    settings: EngineSettings,
    render: RenderManager,
    meshManager: MeshManager,
    data: {
        worldBounds: WorldBounds,
        spaces: WorldSpaces,
    },
    textures: TextureManager,
    tasks: RenderTasks,
    async $INIT(initData) {
        await InitWorkers(this, initData);
    },
    async $SCENEINIT(data) {
        this.babylon.$INIT(data.system);
        await $INITFunction(this, data.scene);
    },
    getSceneTool() {
        return new SceneTool();
    },
};
