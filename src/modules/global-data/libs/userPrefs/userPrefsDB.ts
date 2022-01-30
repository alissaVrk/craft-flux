import axios from "axios";
import { getDefaultAxiosConfig } from "core/axios-defaults";

type Entry = {
    id: string,
    key: string,
    person: string,
    value: string //json
}
//we will probably do this more than once to fetch different data..
export async function fetchSelectedWorkSpace() {
    const result = await axios.get<Array<Entry>>("uservalue", getDefaultAxiosConfig());
    const list = result.data;
    const entry = list.find(it => it.key === "last:active:product");
    return entry && JSON.parse(entry.value);
}