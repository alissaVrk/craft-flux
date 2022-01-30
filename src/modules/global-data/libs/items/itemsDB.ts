import axios from "axios";
import { getDefaultAxiosConfig } from "core/axios-defaults";
import { Item } from "../../types";

export async function fetchAll(productId: string, userId: string): Promise<Item[]> {
    const result = await axios.post("sync/update", {
        limit: 5000,
        productId: productId,
        skip: 0,
        storageName: "items",
        userId: userId // why the fuck do I need this?
    },
        getDefaultAxiosConfig()
    );

    return result.data.items;
}