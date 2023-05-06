export class Mappable<T> extends Map<string, T> {

    asArray(): T[] {
        return [...this.values()]
    }
    keysAsArray(): string[] {
        return [...this.keys()]
    }
}