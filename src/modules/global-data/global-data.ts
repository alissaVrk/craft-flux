import { User } from "./dataTypes";
import { libsRegistry, ordered } from "./libs/libsRegistry";
import { Libs } from "./LibsTypes";
import { Orchestrator } from "./Orchestrator";

export { Orchestrator } from "./Orchestrator";

export async function initOrchestrator(userInfo: User){
    const orchestrator = new Orchestrator<Libs>(userInfo, libsRegistry, ordered);
    const state = await orchestrator.init();
    return state;
} 