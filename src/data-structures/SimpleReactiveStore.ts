import {without} from "lodash";
import { useEffect, useState } from "react";

export type SimpleReactiveStore = ReturnType<typeof createSimpleReactiveStore>;

export function createSimpleReactiveStore() {
    const data = new Map<string, any>();
    const registry = new Map<string, (React.Dispatch<any>[])>();

    function setValue(path: string, value: unknown) {
        data.set(path, value)
        const listeners = registry.get(path);
        if (!listeners) {
            return;
        }
        listeners.forEach(li => li(value));
    }

    function useValue<T>(path: string, defaultValue?: T) {
        const [value, setValue] = useState(data.get(path) || defaultValue);

        useEffect(() => {
            if (!registry.has(path)) {
                registry.set(path, []);
            }
            registry.get(path)!.push(setValue);
            return () => {
                registry.set(path, without(registry.get(path), setValue));
            }
        });
    
        return value;
    }

    return {
        useValue,
        setValue
    }
}
// export class SimpleReactiveStore {
//     private data = new Map<string, any>()
//     private registry = new Map<string, (React.Dispatch<any>[])>();

//     public setValue(path: string, value: unknown) {
//         this.data.set(path, value)
//         const listeners = this.registry.get(path);
//         if (!listeners) {
//             return;
//         }
//         listeners.forEach(li => li(value));
//     }

//     public useValue<T>(path: string, defaultValue?: T) {
//         const [value, setValue] = useState(this.data.get(path) || defaultValue);

//         useEffect(() => {
//             if (!this.registry.has(path)) {
//                 this.registry.set(path, []);
//             }
//             this.registry.get(path)!.push(setValue);
//             return () => {
//                 this.registry.set(path, without(this.registry.get(path), setValue));
//             }
//         });
    
//         return value;
//     }
// }