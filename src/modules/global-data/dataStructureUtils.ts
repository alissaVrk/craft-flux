export function arrayToEntries<T>(items: Array<T>, key: keyof T){
    return items.map(it => ([it[key], it] as [T[keyof T], T]));
}

export function arrayToMap<T>(items: Array<T>, key: keyof T) {
    return new Map<T[keyof T], T>(arrayToEntries(items, key))
}