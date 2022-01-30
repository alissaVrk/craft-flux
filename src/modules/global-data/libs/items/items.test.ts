import { arrayToMap } from "modules/global-data/dataStructureUtils";
import { User, Item } from "../../types";
import {libConfig} from "./items";
import * as itemsDB from "./itemsDB";

describe("items lib",() => {
    const user = {
        id: "1",
    } as User;

    describe("handle dependecy change", () => {
        it("it should return same map if it's empty and no selected product", async () => {
            const items = libConfig.init();
            expect(items.items).toBeUndefined(); 

            const newItems = await libConfig.handleDependencyChange({user, userPrefs: {}}, items);

            expect(newItems).toBe(items);
            expect(newItems.items).toBeUndefined(); 
        });

        it("should fetch items for newely set product", async () => {
            const items = libConfig.init();
            const itemsFromDB = [{
                id: "item1"
            }, {
                id: "item2"
            }] as Item[];
            jest.spyOn(itemsDB, "fetchAll").mockImplementation(() => Promise.resolve(itemsFromDB));

            const newItems = await libConfig.handleDependencyChange({user, userPrefs: {selectedProduct: "p1"}}, items);

            expect(newItems).not.toBe(items);
            expect(newItems.items).toEqual(arrayToMap(itemsFromDB, "id"));
        });

        it("should fetch items and return new map for different product", async () => {
            const items = libConfig.init();
            const itemsFromDB = [{
                id: "item1"
            }, {
                id: "item2"
            }] as Item[];
            jest.spyOn(itemsDB, "fetchAll").mockImplementation(() => Promise.resolve(itemsFromDB));
            
            const newItems1 = await libConfig.handleDependencyChange({user, userPrefs: {selectedProduct: "p1"}}, items);
            expect(newItems1.items?.size).toBe(2);

            itemsFromDB.push({id: "item3"} as Item);
            const newItems2 = await libConfig.handleDependencyChange({user, userPrefs: {selectedProduct: "p2"}}, newItems1);
            expect(newItems2).not.toBe(newItems1);
            expect(newItems2.items?.size).toBe(3);
        });

        it("should fetch items and return new map for SAME product", async () => {
            const items = libConfig.init();
            const itemsFromDB = [{
                id: "item1"
            }, {
                id: "item2"
            }] as Item[];
            jest.spyOn(itemsDB, "fetchAll").mockImplementation(() => Promise.resolve(itemsFromDB));
            const userPrefs = {selectedProduct: "p1"};
            
            const newItems1 = await libConfig.handleDependencyChange({user, userPrefs: userPrefs}, items);
            expect(newItems1.items?.size).toBe(2);

            itemsFromDB.push({id: "item3"} as Item);
            const newItems2 = await libConfig.handleDependencyChange({user, userPrefs: userPrefs}, newItems1);
            expect(newItems2).not.toBe(newItems1);
            expect(newItems2.items?.size).toBe(3);
        });

        it("should throw error if fetch fails", async () => {
            const items = libConfig.init();
            jest.spyOn(itemsDB, "fetchAll").mockImplementation(() => Promise.reject("some Error"));

            await expect( 
                libConfig.handleDependencyChange({user, userPrefs: {selectedProduct: "p1"}}, items)
            ).rejects.toMatch("some Error");
        })
    });
});