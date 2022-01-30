import { MapFullImmutable, MapItemImmutable } from "data-structures"

export type User = {
    email: string
    id: string
    firstName: string
}
export enum ItemType {
    Feature = "page",
    Epic = "topic",
    SubFeature = "subtask",
    DD= "feature",
    RR="req"

}
export type Item = {
    id: string,
    type: ItemType,
    title: string
}

export type WorkSpace = {
    id: string,
    name: string
}

export type UserPrefs = {
    selectedProduct?: string
}

