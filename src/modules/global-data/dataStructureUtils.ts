import { forOwn } from "lodash";

export function arrayToEntries<T>(items: Array<T>, key: keyof T){
    return items.map(it => ([it[key], it] as [T[keyof T], T]));
}

export function arrayToMap<T>(items: Array<T>, key: keyof T) {
    return new Map<T[keyof T], T>(arrayToEntries(items, key))
}

export function mapObjectValue<T, R extends {[key in keyof T]: R[key]}>
    (obj: T, modifier: (item: T[keyof T]) => R[keyof T]){

    const ret: Partial<R> = {};
    forOwn(obj, (item, key) => {
        ret[key as keyof T] = modifier(item);
    });

    return ret as R;
}