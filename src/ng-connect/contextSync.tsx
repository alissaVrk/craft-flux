import { SimpleReactiveStore } from "data-structures";
import React, { useMemo, useContext, Context } from "react";

type ContextProps<T> = {context: Context<T>, path: string, simpleStore: SimpleReactiveStore};

export function ContextListener<T>({context, path, simpleStore}: ContextProps<T> ) {
    const value = useContext(context);

    useMemo(() => {
        simpleStore.setValue(path, value);
    }, [value]);

    return null
}

export function LinkProvider<T>(
    {children, path, context, simpleStore, defaultValue}: 
    React.PropsWithChildren<ContextProps<T> & {defaultValue: T}>) {
    const data = simpleStore.useValue(path);

    return (
        //@ts-ignore
        <context.Provider value={data}>
            {children}
        </context.Provider>
    )
}