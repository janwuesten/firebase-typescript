import { Timestamp } from "firebase-admin/firestore"
import { DocumentMap } from "./DocumentMap"
import { DocumentData, FieldType } from "../types/DocumentTypes"
import { EventDefineCallback } from "../types/DefineTypes"

export class DocumentParserListener {
    event: string
    listener: EventDefineCallback

    constructor(event: string, listener: EventDefineCallback) {
        this.event = event
        this.listener = listener
    }
}
export class DocumentParserDefinition {
    private __field: string
    private __remoteField: string
    private __type: FieldType
    private __defaultValue: unknown = null
    private __defineMap: ((data: DocumentData) => DocumentMap) | null = null
    private __readonly: boolean = false

    get _field() {
        return this.__field
    }
    get _remoteField() {
        return this.__remoteField
    }
    get _type() {
        return this.__type
    }
    get _defaultValue() {
        return this.__defaultValue
    }
    get _defineMap() {
        return this.__defineMap
    }
    get _readonly() {
        return this.__readonly
    }

    constructor(prop: string, fieldType: FieldType) {
        this.__field = prop
        this.__remoteField = prop
        this.__type = fieldType
    }

    defaultValue(defaultValue: unknown) {
        this.__defaultValue = defaultValue
        return this
    }
    remoteField(field: string) {
        this.__remoteField = field
        return this
    }
    defineMap(definer: (data: DocumentData) => DocumentMap) {
        this.__defineMap = definer
        return this
    }
    readonly() {
        this.__readonly = true
        return this
    }
}
export abstract class DocumentParser {
    protected _definitions: DocumentParserDefinition[] = []
    protected _listeners: DocumentParserListener[] = []

    constructor() {
        
    }

    async toDocumentMapArray(array: DocumentMap[]): Promise<DocumentData[] | null> {
        if (!array) {
            return null
        }
        const items: DocumentData[] = []
        for (const item of array) {
            items.push(await item.toData())
        }
        return items
    }
    async fromDocumentMapArray<T extends DocumentMap>(data: DocumentData[], generator: (data: DocumentData) => T): Promise<T[] | null> {
        if (!data) {
            return null
        }
        const items: T[] = []
        if (data) {
            for (const item of data) {
                items.push(await generator(item).fromData(item))
            }
        }
        return items
    }
    async toDocumentMapMappable(mappable: Map<string, DocumentMap>): Promise<Record<string, DocumentData> | null> {
        if (!mappable) {
            return null
        }
        const items: Record<string, DocumentData> = {}
        for (const [key, val] of Object.entries(Object.fromEntries(mappable))) {
            items[key] = await val.toData()
        }
        return items
    }
    async fromDocumentMapMappable<T extends DocumentMap>(data: DocumentData, generator: (data: DocumentData) => T): Promise<Map<string, T> | null> {
        if (!data) {
            return null
        }
        const items: Map<string, T> = new Map()
        if (data) {
            for (const [key, val] of Object.entries(data)) {
                items.set(key, await generator(val as DocumentData).fromData(val as DocumentData))
            }
        }
        return items
    }
    clone<T extends DocumentParser>(): T {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this)
    }

    async fromData(data: DocumentData) {
        const self = this as any
        const beforeReadListeners = this._listeners.filter((a) => a.event == "beforeRead")
        await Promise.all(beforeReadListeners.map(async (listener) => {
            await listener.listener()
        }))
        for (const definition of this._definitions) {
            if (data[definition._remoteField] == null) {
                self[definition._field] = definition._defaultValue
            } else {
                switch (definition._type) {
                    case "timestamp":
                        self[definition._field] = (data[definition._remoteField] as Timestamp).toDate()
                        break
                    case "map":
                        if (!definition._defineMap) {
                            throw new Error(`map definition for field ${definition._field} missing. Define with .defineMap()`)
                        }
                        self[definition._field] = await definition._defineMap(data[definition._remoteField] as DocumentData).fromData(data[definition._remoteField] as DocumentData)
                        break
                    case "mapArray":
                        if (!definition._defineMap) {
                            throw new Error(`map definition for field ${definition._field} missing. Define with .defineMap()`)
                        }
                        self[definition._field] = await this.fromDocumentMapArray(data[definition._remoteField] as DocumentData[], definition._defineMap!)
                        break
                    case "mapMappable":
                        if (!definition._defineMap) {
                            throw new Error(`map definition for field ${definition._field} missing. Define with .defineMap()`)
                        }
                        self[definition._field] = await this.fromDocumentMapMappable(data[definition._remoteField] as DocumentData, definition._defineMap!)
                        break
                    default:
                        self[definition._field] = data[definition._remoteField]
                        break
                }
            }
        }
        const afterReadListeners = this._listeners.filter((a) => a.event == "afterRead")
        await Promise.all(afterReadListeners.map(async (listener) => {
            await listener.listener()
        }))
        return this
    }
    async toData(): Promise<DocumentData> {
        const data: DocumentData = {}
        const self = this as any
        const beforeWriteListeners = this._listeners.filter((a) => a.event == "beforeWrite")
        await Promise.all(beforeWriteListeners.map(async (listener) => {
            await listener.listener()
        }))
        for (const definition of this._definitions) {
            if (!definition._readonly) {
                if (self[definition._field] == undefined || self[definition._field] == null) {
                    data[definition._remoteField] = null
                } else {
                    switch (definition._type) {
                        case "map":
                            data[definition._remoteField] = await (self[definition._field] as DocumentMap).toData()
                            break
                        case "mapArray":
                            data[definition._remoteField] = await this.toDocumentMapArray(self[definition._field])
                            break
                        case "mapMappable":
                            data[definition._remoteField] = await this.toDocumentMapMappable(self[definition._field])
                            break
                        default:
                            data[definition._remoteField] = self[definition._field]
                            break
                    }
                }
            }
        }
        const afterWriteListeners = this._listeners.filter((a) => a.event == "afterWrite")
        await Promise.all(afterWriteListeners.map(async (listener) => {
            await listener.listener()
        }))
        return data
    }
}