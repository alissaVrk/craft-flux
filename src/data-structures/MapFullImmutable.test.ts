import {MapFullImmutable} from "./MapFullImmutable"

type TestItem = {
    id: string
    name: string
}

describe("MapFullImmutable", () => {
    let map: MapFullImmutable<string, TestItem>;

    beforeEach(() => {
        map = new MapFullImmutable<string, TestItem>();
        map.init([{id: "1", name: "aaa"}]);
    })
    it("should add items", () => {
        const items = map.items;
        expect(map.items).toBe(items);
        expect(map.items?.size).toBe(1);

        map.addItems([{name: "bbb"}]);

        expect(map.items).not.toBe(items);
        expect(map.items?.size).toBe(2);
    });

    it("should update items", () => {
        const items = map.items;

        map.updateItems([{id: "1", name: "other aa"}]);

        expect(map.items).not.toBe(items);
        expect(map.items?.size).toBe(1);
    });

    it("should create new ref even if nothing was updated and throw..", () => {
        const items = map.items;

        expect(() => map.updateItems([{id: "non existing", name: "other aa"}])).toThrow();

        expect(map.items).not.toBe(items);
        expect(map.items?.size).toBe(1);
    });

    it("should remove items", () => {
        const items = map.items;

        map.removeItems(["1", "2"]);

        expect(map.items).not.toBe(items);
        expect(map.items?.size).toBe(0);
    });

    it("should not create new ref if nothing was removed", () => {
        const items = map.items;

        map.removeItems([ "2"]);

        expect(map.items).toBe(items);
        expect(map.items?.size).toBe(1);
    });
}); 