import { User } from "./dataTypes";
import { compact, every, intersection, keyBy } from "lodash";
import { MapItemImmutable } from "data-structures/MapItemImmputable";
import { ConfigKey, LibsRegistry } from "./LibsTypes";
import { mapObjectValue } from "./dataStructureUtils";

function isEmpty(item?: Object) {
    if (item instanceof MapItemImmutable) {
        return !item.items;
    }
    return !item;
}

type MetaState<T> = {
    id: keyof T,
    isFetching: boolean
}

export class Orchestrator<T> {
    private state: T;
    private ordered: Array<ConfigKey<T>>;
    private registry: LibsRegistry<T>;
    private metaState: MapItemImmutable<keyof T, MetaState<T>>;

    constructor(userInfo: User, registry: LibsRegistry<T>, ordered: Array<ConfigKey<T>>) {
        this.registry = registry;
        this.ordered = ordered;
        this.state = {
            ...mapObjectValue(registry, (config) => config.init()),
            user: userInfo
        }
        this.metaState = new MapItemImmutable<keyof T, MetaState<T>>();
        this.metaState.init(Object.keys(this.state).map(key => ({ id: key as keyof T, isFetching: false })));
    }

    async init() {
        await this.applyDepsRec("ALL");
        return this.state;
    }

    private async applyDepsRec(changes: Array<ConfigKey<T>> | "ALL") {
        let nextChanges = changes;
        while((nextChanges.length > 0 || nextChanges === "ALL")) {
            nextChanges = await this.applyDepsCycle(nextChanges);
        }
    }

    private async applyDepsCycle(changes: Array<ConfigKey<T>> | "ALL") {
        const promises = this.ordered.map(key => {
            if ((changes !== "ALL" && !this.isDependecyOf(key, changes)) || !this.areAllDepsMet(key)) {
                return Promise.resolve({lib: key, hasChanged: false});
            }
            this.metaState.updateItems([{ id: key, isFetching: true }]);
            const libState = this.state[key];
            //@ts-ignore //TODO types!!
            return this.registry[key].handleDependencyChange(this.getDependenciesOf(key), libState)
                .then(val => {
                    const hasChanged = this.state[key] !== val;
                    //@ts-ignore //TODO types!!
                    this.state[key] = val;
                    this.metaState.updateItems([{id: key, isFetching: false}]);
                    return {
                        lib: key,
                        hasChanged
                    };
                });
        })

        const libChanges = await Promise.all(promises);
        return compact(libChanges.map(it => it.hasChanged ? it.lib : undefined));
    }

    private areAllDepsMet(libKey: ConfigKey<T>) {
        const deps = this.registry[libKey].dependencies;
        return every(deps, dep => !isEmpty(this.state[dep]));
    }

    private isDependecyOf(libKey: ConfigKey<T>, depKeys: Array<keyof T>) {
        const libDeps = this.registry[libKey].dependencies;
        return intersection(libDeps, depKeys).length > 0;
    }

    private getDependenciesOf(libKey: ConfigKey<T>) {
        const libDeps = this.registry[libKey].dependencies;
        const keysMap = keyBy(libDeps) as { [key in keyof T]: key };
        return mapObjectValue<typeof keysMap, T>(keysMap, (depName) => this.state[depName]);
    }
}