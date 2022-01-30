import { find } from "lodash";
import { MapItemImmutable } from "./MapItemImmputable"

type TestItem = {
    id: string
    name: string
}
describe("MapItemImmutable", () => {
    describe("init", () => {
        it("should be undefined before init", () => {
            const map = new MapItemImmutable();
            expect(map.items).toBe(undefined);
        });

        it("should throw on add before init", () => {
            const map = new MapItemImmutable();
            expect(() => map.addItems([{ id: "1", name: "yossi" }])).toThrow("you need initialize your data first");
        });

        it("should throw on delete before init", () => {
            const map = new MapItemImmutable();
            expect(() => map.removeItems(["1"])).toThrow("you need initialize your data first");
        });

        it("should throw on update before init", () => {
            const map = new MapItemImmutable<string, TestItem>();
            expect(() => map.updateItems([{ id: "1", name: "yossi" }])).toThrow("you need initialize your data first");
        });

        it("should init with items", () => {
            const map = new MapItemImmutable<string, TestItem>();
            map.init([{ id: "1", name: "yossi" }, { id: "2", name: "moshe" }]);

            expect(map.items?.get("2")).toEqual({ id: "2", name: "moshe" });
        });
    });

    describe("operations", () => {
        let map: MapItemImmutable<string, TestItem>;
        beforeEach(() => {
            map = new MapItemImmutable<string, TestItem>();
            map.init([{ id: "1", name: "yossi" }]);
        });

        it("should add items", () => {
            const addedIds = map.addItems([{ name: "moshe" }, { name: "hanna" }]);
            const ids = map.filterIds(it => it.name === "moshe");
            const itemId = ids[0]

            expect(addedIds.length).toBe(2);
            expect(addedIds[0]).toBe(itemId);

            expect(itemId).toContain("temp_");
            expect(map.items?.get(itemId)?.name).toBe("moshe");
        });

        it("it will add same item twice, with new id", () => {
            const [id1] = map.addItems([{ name: "moshe" }]);
            const [id2] = map.addItems([{ name: "moshe" }]);

            const ids = map.filterIds(it => it.name === "moshe");

            expect(ids.length).toBe(2);
            expect(id1).not.toBe(id2);
        });

        it("should update items", () => {
            const [id1, id2] = map.addItems([{ name: "moshe" }, { name: "hanna" }]);
            const updatedIds = map.updateItems([{ id: "1", name: "other yossi" }, { id: id1, name: "other moshe" }]);

            expect(updatedIds.length).toBe(2);
            expect(updatedIds[1]).toBe(id1);

            expect(map.items!.get(id1)?.name).toBe("other moshe");
            expect(map.items!.get("1")?.name).toBe("other yossi");
        });

        it("should throw on trying to update non existin items, but update the rest..?", () => {
            const [id1] = map.addItems([{ name: "moshe" }]);

            expect(() => map.updateItems([
                    { id: "1", name: "other yossi" },
                    { id: "non existing", name: "other Hanna" },
                    { id: id1, name: "other moshe" }
                ])
            ).toThrow(`you cannot update item that doesn't exist ${["non existing"]}`);

            expect(map.items!.get("1")?.name).toBe("other yossi");
            expect(map.items!.get(id1)?.name).toBe("other moshe");
            expect(map.items?.get("non existing")).toBeUndefined();
        });

        it("should remove items", () => {
            const [id1, id2] = map.addItems([{ name: "moshe" }, { name: "hanna" }]);
            expect(map.items?.size).toBe(3);

            const removedIds = map.removeItems(["1", id1]);

            expect(removedIds).toEqual(["1", id1]);
            expect(map.items?.size).toBe(1);
        });

        it("should not throw for removing non existing item, but exclude from returned array", () => {
            expect(map.items?.size).toBe(1);

            const removedIds = map.removeItems(["2"]);

            expect(removedIds).toEqual([]);
            expect(map.items?.size).toBe(1);
        })
    })
});