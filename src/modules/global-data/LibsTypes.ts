import { MapFullImmutable, MapItemImmutable } from "data-structures"
import { WorkSpace, UserPrefs, Item, User } from "./dataTypes"

export type Libs = {
    producs: MapFullImmutable<string, WorkSpace>,
    userPrefs: UserPrefs | undefined,
    items: MapItemImmutable<string, Item>,
    user: User
}

export type LibConfig<T, C, Deps extends keyof C | never> = {
    dependencies: Deps[],
    init: () => T,
    handleDependencyChange: (
        deps: {[key in Deps]: Readonly<C[key]>}, 
        itemsMap: T 
    ) => Promise<T>
}

export type ConfigKey<T> = keyof Omit<T, "user">;
export type LibsRegistry<T> = {[key in ConfigKey<T>]: LibConfig<T[key], T, keyof T> };