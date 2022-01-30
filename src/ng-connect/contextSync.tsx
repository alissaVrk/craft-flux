import { SimpleReactiveStore } from "data-structures";
import React, { useContext, Context, useEffect } from "react";

type ContextProps<T> = {
    context: Context<T>,
    path: string,
    simpleStore: SimpleReactiveStore
};

export function ContextListener<T>({ context, path, simpleStore }: ContextProps<T>) {
    const value = useContext(context);

    useEffect(() => {
        simpleStore.setValue(path, value);
    }, [value]);

    return null
}

export function LinkProvider<T>(
    { children, path, context, simpleStore, defaultContextValue }:
        React.PropsWithChildren<ContextProps<T> & { defaultContextValue: T }>) {

    const data = simpleStore.useValue(path, defaultContextValue);

    return (
        <context.Provider value={data}>
            {children}
        </context.Provider>
    )
}