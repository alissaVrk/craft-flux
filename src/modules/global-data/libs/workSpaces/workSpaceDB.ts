import axios from "axios";
import { getDefaultAxiosConfig } from "core/axios-defaults";

export async function fetchAll() {
    const result = await axios.get("products", getDefaultAxiosConfig());
    return result.data.list;
}