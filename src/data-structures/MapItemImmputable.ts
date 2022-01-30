import { uniqueId } from "lodash"

export class MapItemImmutable<T extends {id: string}> {
    protected data: Map<string, T> | undefined;

    init(items: T[]){
        this.data = new Map(items.map(it => ([it.id, it])));
    }
    //they are sending the whole expanded item.. how does the server resolve conflicts..?
    updateItems(items: (Partial<T> & {id: string})[]) {
        if (!this.data) {
            throw new Error("you need initialize your data first");
        }
        const failed: string[] = [];
        items.forEach(it => {
            const currentItem = this.data!.get(it.id);
            if (!currentItem) {
                failed.push(it.id);
                return;
            }
            this.data!.set(it.id, {...currentItem, ...it});
        })
        if (failed.length) {
            throw new Error(`you cannot update item that doesn't exist ${failed}`);
        }
        return items.map(it => it.id);
    }

    addItems(items: Omit<T, "id">[]) {
        if (!this.data) {
            throw new Error("you need initialize your data first");
        }
        const newItems = items.map(it => ({...it, id: uniqueId("temp_")})) as T[];
        newItems.forEach(it => this.data!.set(it.id, it));
        return newItems.map(it => it.id);
    }

    removeItems(ids: string[]) {
        if (!this.data) {
            throw new Error("you need initialize your data first");
        }
        const removed: string[] = [];
        ids.forEach(id => {
            const hasRemoved = this.data!.delete(id);
            if (hasRemoved) {
                removed.push(id);
            }
        })
        
        return removed;
    }

    get items(): ReadonlyMap<string, T>  | undefined {
        return this.data;
    }

    filterIds(filter: (item: T) => boolean): string[] {
        if (!this.data) {
            return [];
        }
        return Array.from(this.data)
            .filter(([key, it]) => filter(it))
            .map(([key, it]) => it.id);
    }
}