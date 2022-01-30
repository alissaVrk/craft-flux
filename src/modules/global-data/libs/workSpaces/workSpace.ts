import { MapFullImmutable } from "data-structures";
import { uniqueId } from "lodash";
import { fetchAll } from "./workSpaceDB";
import { WorkSpace } from "../../dataTypes";
import { LibConfig, Libs } from "../../LibsTypes";

export const name = uniqueId("userPrefs_");

export const libConfig: LibConfig<Libs["producs"], Libs, never> = {
    dependencies: [],

    init: () => new MapFullImmutable<string, WorkSpace>(),

    handleDependencyChange: async  () => {
        const items = await fetchAll();
        const newItemsMap = new MapFullImmutable<string, WorkSpace>();
        newItemsMap.init(items);
        return newItemsMap;
    }
}