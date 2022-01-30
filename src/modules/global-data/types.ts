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

export type Libs = {
    producs: MapFullImmutable<WorkSpace>,
    userPrefs: UserPrefs | undefined,
    items: MapItemImmutable<Item>,
    user: User
}



export type LibConfig<K extends keyof Libs, Deps extends keyof Libs | never > = {
    dependencies: Deps[],
    init: () => Libs[K],
    handleDependencyChange: (
        deps: {[key in Deps]: Readonly<Libs[key]>}, 
        itemsMap: Libs[K] 
    ) => Promise<Libs[K]>
}