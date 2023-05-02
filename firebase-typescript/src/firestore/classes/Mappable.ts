export class Mappable<T> extends Map<string, T> {
    private _map = new Map<string, T>

    asArray(): T[] {
        return [...this._map.values()]
    }
    keysAsArray(): string[] {
        return [...this._map.keys()]
    }
}