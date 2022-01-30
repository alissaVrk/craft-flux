import { MapItemImmutable } from "./MapItemImmputable";

export class MapFullImmutable<KeyType, T extends {id: KeyType}> extends MapItemImmutable<KeyType, T> {
    private cloneData() {
        if (!this.data) {
            throw new Error("you need initialize your data first");
        }
        this.data = new Map<KeyType, T>(this.data);
    }

    addItems(items: Omit<T, "id">[]) {
        this.cloneData();    
        return super.addItems(items);
    }

    updateItems(items: (Partial<T> & { id: KeyType; })[]){
        this.cloneData();
        return super.updateItems(items);
    }

    removeItems(ids: KeyType[]) {
        const prevData = this.data;
        this.cloneData();
        const removed = super.removeItems(ids);
        if (!removed.length) {
            this.data = prevData;
        }
        return removed;
    }
}