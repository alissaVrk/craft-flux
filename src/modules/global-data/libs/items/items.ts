import { MapItemImmutable } from "data-structures";
import { uniqueId } from "lodash";
import { fetchAll } from "./itemsDB";
import { Item } from "../../dataTypes";
import { LibConfig, Libs } from "../../LibsTypes";

export const name = uniqueId("items_");

export const libConfig: LibConfig<Libs["items"], Libs, "userPrefs" | "user"> = {
    dependencies: ["userPrefs", "user"],

    init: () => new MapItemImmutable<string, Item>(),

    handleDependencyChange: async (deps, itemsMap) => {
        const newMap = new MapItemImmutable<string, Item>();
        if (!deps.userPrefs?.selectedProduct && !!itemsMap.items) {
            return newMap;
        } else if (!deps.userPrefs?.selectedProduct) {
            return itemsMap;
        }
        const items = await fetchAll(deps.userPrefs.selectedProduct, deps.user.id)
        newMap.init(items);
        return newMap;
    }
}