import {without} from "lodash";
import { useEffect, useState } from "react";

export class SimpleReactiveStore {
    private data = new Map<string, any>()
    private registry = new Map<string, (React.Dispatch<any>[])>();

    public setValue(path: string, value: unknown) {
        this.data.set(path, value)
        const listeners = this.registry.get(path);
        if (!listeners) {
            return;
        }
        listeners.forEach(li => li(value));
    }

    public useValue(path: string) {
        const [value, setValue] = useState(this.data.get(path));

        useEffect(() => {
            if (!this.registry.has(path)) {
                this.registry.set(path, []);
            }
            this.registry.get(path)!.push(setValue);
            return () => {
                this.registry.set(path, without(this.registry.get(path), setValue));
            }
        });
    
        return value;
    }
}