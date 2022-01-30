import { MapItemImmutable } from "./MapItemImmputable";

export class MapFullImmutable<T extends {id: string}> extends MapItemImmutable<T> {
    private cloneData() {
        if (!this.data) {
            throw new Error("you need initialize your data first");
        }
        this.data = new Map<string, T>(this.data);
    }

    addItems(items: Omit<T, "id">[]): string[] {
        this.cloneData();    
        return super.addItems(items);
    }

    updateItems(items: (Partial<T> & { id: string; })[]): (T["id"] & string)[] {
        this.cloneData();
        return super.updateItems(items);
    }

    removeItems(ids: string[]): string[] {
        const prevData = this.data;
        this.cloneData();
        const removed = super.removeItems(ids);
        if (!removed.length) {
            this.data = prevData;
        }
        return removed;
    }
}