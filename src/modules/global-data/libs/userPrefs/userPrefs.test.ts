import {libConfig}  from "./userPrefs";
import * as userPrefsDB from "./userPrefsDB";

describe("uer prefs lib", () => {
    describe("fetch", () => {
        it("should fetch user prefs", async () => {
            const prefs = libConfig.init();
            jest.spyOn(userPrefsDB, "fetchSelectedWorkSpace").mockImplementation(() => 
                Promise.resolve("p1")
            );

            const newPrefs = await libConfig.handleDependencyChange({}, prefs);
            
            expect(newPrefs).not.toBe(prefs);
            expect(newPrefs).toEqual({selectedProduct: "p1"});
        });

        it("should throw if fetch fails", async () => {
            const prefs = libConfig.init();
            jest.spyOn(userPrefsDB, "fetchSelectedWorkSpace").mockImplementation(() => 
                Promise.reject("some Error")
            );

            await expect(libConfig.handleDependencyChange({}, prefs)).rejects.toMatch("some Error");
        });

        it("should fetch each time", async () => {
            const prefs = libConfig.init();
            jest.spyOn(userPrefsDB, "fetchSelectedWorkSpace").mockImplementation(() => 
                Promise.resolve("p1")
            );

            const newPrefs1 = await libConfig.handleDependencyChange({}, prefs);
            expect(newPrefs1).not.toBe(prefs);

            const newPrefs2 = await libConfig.handleDependencyChange({}, newPrefs1);
            expect(newPrefs2).not.toBe(newPrefs1);
        });
    });
})