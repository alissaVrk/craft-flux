import { ConfigKey, LibConfig, Libs } from "../LibsTypes";
import {libConfig as itemsConfig} from "./items/items"
import {libConfig as prefsConfig} from "./userPrefs/userPrefs"
import {libConfig as productsConfig} from "./workSpaces/workSpace"

export const libsRegistry: {[key in ConfigKey<Libs>]: LibConfig<Libs[key], Libs, (keyof Libs) | never> } = {
    "items": itemsConfig,
    "producs": productsConfig,
    "userPrefs": prefsConfig,
}

export const ordered: Array<ConfigKey<Libs>> = ["producs", "userPrefs", "items"];