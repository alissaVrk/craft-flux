import { arrayToMap } from "modules/global-data/dataStructureUtils";
import { WorkSpace } from "../../dataTypes";
import {libConfig} from "./workSpace";
import * as workSpaceDB from "./workSpaceDB"

describe("workSpaces lib", () => {
    describe("fetch", () => {
        it("should fetch items and return new instance", async () => {
            const workSpaces = libConfig.init();
            const itemsFromDB = [{id: "p1"}] as WorkSpace[]

            jest.spyOn(workSpaceDB, "fetchAll").mockImplementation(() => 
                Promise.resolve(itemsFromDB)
            );

            const newWorkSpace = await libConfig.handleDependencyChange({}, workSpaces);

            expect(newWorkSpace).not.toBe(workSpaces);
            expect(newWorkSpace.items).toEqual(arrayToMap(itemsFromDB, "id"));
        });

        it("should throw if fetch fails", async () => {
            const workSpaces = libConfig.init();
            jest.spyOn(workSpaceDB, "fetchAll").mockImplementation(() => 
                Promise.reject("some Error")
            );

            await expect(libConfig.handleDependencyChange({}, workSpaces)).rejects.toMatch("some Error");
        });

        it("should fetch again for each call", async () => {
            const workSpaces = libConfig.init();
            const itemsFromDB = [{id: "p1"}] as WorkSpace[]

            jest.spyOn(workSpaceDB, "fetchAll").mockImplementation(() => 
                Promise.resolve(itemsFromDB)
            );

            const newWorkSpace1 = await libConfig.handleDependencyChange({}, workSpaces);
            expect(newWorkSpace1).not.toBe(workSpaces);

            const newWorkSpace2 = await libConfig.handleDependencyChange({}, newWorkSpace1);
            expect(newWorkSpace2).not.toBe(newWorkSpace1);
        })
    });
})