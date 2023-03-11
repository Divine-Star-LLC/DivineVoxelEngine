import { ThreadComm } from "threadcomm";
import { RegisterDataHooks } from "../Hooks/Data/DataHooks.js";
import { WorldThreadState } from "../Threads/WorldThreadState.js";
export async function InitWorldWorker(DVEW) {
    let parent = "render";
    if (DVEW.environment == "node") {
        parent = "server";
    }
    await ThreadComm.$INIT("world", parent);
    RegisterDataHooks();
    await DVEW.UTIL.createPromiseCheck({
        check: () => {
            return WorldThreadState.isReady();
        },
        checkInterval: 1,
    });
}
