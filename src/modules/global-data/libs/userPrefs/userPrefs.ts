import { uniqueId } from "lodash";
import { fetchSelectedWorkSpace } from "./userPrefsDB";
import { LibConfig } from "../../types";

export const name = uniqueId("userPrefs_");

export const libConfig: LibConfig<"userPrefs", never> = {
    dependencies: [],

    init: () => undefined,

    handleDependencyChange: async (deps, itemsMap) => {
        const selectedProduct = await fetchSelectedWorkSpace();
        if (selectedProduct) {
            return { ...itemsMap, selectedProduct }
        }
        return itemsMap;
    }
}
