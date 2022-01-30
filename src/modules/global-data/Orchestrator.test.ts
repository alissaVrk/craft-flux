import { MapFullImmutable, MapItemImmutable } from "data-structures";
import { User } from "./dataTypes";
import { LibsRegistry } from "./LibsTypes";
import {Orchestrator} from "./Orchestrator";

describe("Orchestrator", () => {
    type Categ = {id: string, title: string};
    type Item = {id: string, title: string, categ: string};
    type Libs = {
        user: User,
        categs: MapFullImmutable<string, Categ>,
        items: MapItemImmutable<string, Item>,
        desc: {stuffA: string} | undefined
    }
    function getCategsMap () {
        const map = new MapFullImmutable<string, Categ>();
        map.init([{id: "c1", title: "ttt"}, {id: "c2", title: "ttt"}]);
        return map
    }

    function getItemsMap (categId: string) {
        const map = new MapItemImmutable<string, Item>();
        map.init([{id: "c1", title: "ttt", categ: categId}, {id: "c2", title: "ttt", categ: categId}]);
        return map;
    }
    const registry: LibsRegistry<Libs> = {
        categs: {dependencies:[], init: () =>  new MapFullImmutable<string, Categ>(), handleDependencyChange:() => {
            const map = getCategsMap();
            return Promise.resolve(map);
        }},
        items: {dependencies: ["categs"], init: () => new MapItemImmutable<string, Item>(), handleDependencyChange: (deps) => {
            const categ = deps.categs.items?.values().next().value;
            const map = getItemsMap(categ.id);
            return Promise.resolve(map);
        }},
        desc: {dependencies: [], init: () => undefined, handleDependencyChange: () => {
            return Promise.resolve({stuffA: "sssss"});
        }}
    }
    describe("constructor", () => {
        it("should be born with only user data and all other undefined", () => {

        });
    });
    describe("init - dependecies change", () => {
        it("should fetch and populate all data", async () => {
            const orchestrator = new Orchestrator<Libs>({id: "user"} as User, registry, ["desc", "categs", "items"]);
            const state = await orchestrator.init();
            expect(state).toEqual({
                user: {id: "user"},
                categs: getCategsMap(),
                items: getItemsMap("c1"),
                desc: {stuffA: "sssss"}
            });
        });

        it("should set state to loading to all loading libs", () => {

        });

        it("should notify on intermidiate state change, rest should be fetching", () => {

        });

        it("should have the prev data and error state if lib fetch fails", () => {

        });

        it("should reset error when data is correctly fetched", () => {

        });
    });
});