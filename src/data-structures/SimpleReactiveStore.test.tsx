import { createSimpleReactiveStore } from "./SimpleReactiveStore";
import { renderHook } from '@testing-library/react-hooks'
import { act } from "react-dom/test-utils";

describe("SimpleReactiveStore", () => {
    it("should return undefined if no value was set", () => {
        const store = createSimpleReactiveStore();
        const path = "some.path";

        const state = renderHook(() => store.useValue(path));
        expect(state.result.current).toBeUndefined();
    });

    it("should return default value if default value passed", () => {
        const store = createSimpleReactiveStore();
        const path = "some.path";

        const state = renderHook(() => store.useValue(path, 4));
        expect(state.result.current).toBe(4);
    })

    it("should useValue as set", () => {
        const store = createSimpleReactiveStore();
        const path = "some.path";
        const state = renderHook(() => store.useValue(path));

        act(() => store.setValue(path, 2))
        
        expect(state.result.current).toBe(2);
    });

    it("should update multiple times", () => {
        const store = createSimpleReactiveStore();
        const path = "some.path";
        const state = renderHook(() => store.useValue(path));

        act(() => store.setValue(path, 2))
        expect(state.result.current).toBe(2);

        act(() => store.setValue(path, 4))
        expect(state.result.current).toBe(4);
    });

    it("should NOT use internal value", () => {
        const store = createSimpleReactiveStore();
        const path = "some.path";
        const state = renderHook(() => store.useValue(`${path}.a`));

        act(() => store.setValue(path, { a: 3 }))
        
        expect(state.result.current).toBeUndefined();
    });

    it("should use the value in multiple components", () => {
        const store = createSimpleReactiveStore();
        const path = "some.path";
        const state1 = renderHook(() => store.useValue(path));
        const state2 = renderHook(() => store.useValue(path));

        act(() => store.setValue(path, 2))
        
        expect(state1.result.current).toBe(2);
        expect(state2.result.current).toBe(2);
    });
});