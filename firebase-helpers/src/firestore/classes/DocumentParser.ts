import { Timestamp } from "firebase/firestore"
import { DocumentMap } from "./DocumentMap"
import { DocumentData, FieldType } from "../types/DocumentTypes"

export class DocumentParserDefinition {
    private __field: string
    private __remoteField: string
    private __type: FieldType
    private __defaultValue: unknown = null
    private __defineMap: ((data: DocumentData) => DocumentMap) | null = null
    private __write: boolean = true

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
    get _write() {
        return this.__write
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
    write(canWrite: boolean) {
        this.__write = canWrite
        return this
    }
}
export abstract class DocumentParser {
    protected _definitions: DocumentParserDefinition[] = []

    constructor() {
        
    }

    async toDocumentMapArray(array: DocumentMap[]): Promise<DocumentData[]> {
        const items: DocumentData[] = []
        for (const item of array) {
            items.push(await item.toData())
        }
        return items
    }
    async fromDocumentMapArray<T extends DocumentMap>(data: DocumentData[], generator: (data: DocumentData) => T): Promise<T[]> {
        const items: T[] = []
        if (data) {
            for (const item of data) {
                items.push(await generator(item).fromData(item))
            }
        }
        return items
    }

    async fromData(data: DocumentData) {
        const _self = this as any
        for (const _definition of this._definitions) {
            if (!(_definition._remoteField in data)) {
                _self[_definition._field] = _definition.defaultValue
            } else {

            } if (data[_definition._remoteField] == null) {
                _self[_definition._field] = null
            } else {
                switch (_definition._type) {
                    case "timestamp":
                        _self[_definition._field] = (data[_definition._remoteField] as Timestamp).toDate()
                        break
                    case "map":
                        if (!_definition._defineMap) {
                            throw new Error(`map definition for field ${_definition._field} missing. Define with .defineMap()`)
                        }
                        _self[_definition._field] = await _definition._defineMap(data[_definition._remoteField] as DocumentData).fromData(data[_definition._remoteField] as DocumentData)
                        break
                    case "mapArray":
                        if (!_definition._defineMap) {
                            throw new Error(`map definition for field ${_definition._field} missing. Define with .defineMap()`)
                        }
                        _self[_definition._field] = await this.fromDocumentMapArray(data[_definition._remoteField] as DocumentData[], _definition._defineMap!)
                        break
                    default:
                        _self[_definition._field] = data[_definition._remoteField]
                        break
                }
            }
        }
        return this
    }
    async toData(): Promise<DocumentData> {
        const data: DocumentData = {}
        const _self = this as any
        for (const _definition of this._definitions) {
            if (_definition._write) {
                if (_self[_definition._field] == undefined || _self[_definition._field] == null) {
                    data[_definition._remoteField] = null
                } else {
                    switch (_definition._type) {
                        case "map":
                            data[_definition._remoteField] = await (_self[_definition._field] as DocumentMap).toData()
                            break
                        case "mapArray":
                            data[_definition._remoteField] = await this.toDocumentMapArray(_self[_definition._field])
                            break
                        default:
                            data[_definition._remoteField] = _self[_definition._field]
                            break
                    }
                }
            }
        }
        return data
    }
}