import { MapFullImmutable } from "data-structures";
import { uniqueId } from "lodash";
import { fetchAll } from "./workSpaceDB";
import { LibConfig, WorkSpace } from "../../types";

export const name = uniqueId("userPrefs_");

export const libConfig: LibConfig<"producs", never> = {
    dependencies: [],

    init: () => new MapFullImmutable<WorkSpace>(),

    handleDependencyChange: async  () => {
        const items = await fetchAll();
        const newItemsMap = new MapFullImmutable<WorkSpace>();
        newItemsMap.init(items);
        return newItemsMap;
    }
}