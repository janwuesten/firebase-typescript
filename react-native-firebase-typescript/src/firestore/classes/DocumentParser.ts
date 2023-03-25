import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore"
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

    toDocumentMapArray(array: DocumentMap[]): DocumentData[] {
        const items: DocumentData[] = []
        for (const item of array) {
            items.push(item.toData())
        }
        return items
    }
    fromDocumentMapArray<T extends DocumentMap>(data: DocumentData[], generator: (data: DocumentData) => T): T[] {
        const items: T[] = []
        if (data) {
            for (const item of data) {
                items.push(generator(item).fromData(item))
            }
        }
        return items
    }

    fromData(data: DocumentData) {
        const _self = this as any
        for (const listener of this._listeners) {
            if (listener.event == "beforeRead") {
                listener.listener()
            }
        }
        for (const _definition of this._definitions) {
            if (data[_definition._remoteField] == null) {
                _self[_definition._field] = _definition._defaultValue
            } else {
                switch (_definition._type) {
                    case "timestamp":
                        _self[_definition._field] = (data[_definition._remoteField] as FirebaseFirestoreTypes.Timestamp).toDate()
                        break
                    case "map":
                        if (!_definition._defineMap) {
                            throw new Error(`map definition for field ${_definition._field} missing. Define with .defineMap()`)
                        }
                        _self[_definition._field] = _definition._defineMap(data[_definition._remoteField] as DocumentData).fromData(data[_definition._remoteField] as DocumentData)
                        break
                    case "mapArray":
                        if (!_definition._defineMap) {
                            throw new Error(`map definition for field ${_definition._field} missing. Define with .defineMap()`)
                        }
                        _self[_definition._field] = this.fromDocumentMapArray(data[_definition._remoteField] as DocumentData[], _definition._defineMap!)
                        break
                    default:
                        _self[_definition._field] = data[_definition._remoteField]
                        break
                }
            }
        }
        for (const listener of this._listeners) {
            if (listener.event == "afterRead") {
                listener.listener()
            }
        }
        return this
    }
    toData(): DocumentData {
        const data: DocumentData = {}
        const _self = this as any
        for (const listener of this._listeners) {
            if (listener.event == "beforeWrite") {
                listener.listener()
            }
        }
        for (const _definition of this._definitions) {
            if (!_definition._readonly) {
                if (_self[_definition._field] == undefined || _self[_definition._field] == null) {
                    data[_definition._remoteField] = null
                } else {
                    switch (_definition._type) {
                        case "map":
                            data[_definition._remoteField] = (_self[_definition._field] as DocumentMap).toData()
                            break
                        case "mapArray":
                            data[_definition._remoteField] = this.toDocumentMapArray(_self[_definition._field])
                            break
                        default:
                            data[_definition._remoteField] = _self[_definition._field]
                            break
                    }
                }
            }
        }
        for (const listener of this._listeners) {
            if (listener.event == "afterWrite") {
                listener.listener()
            }
        }
        return data
    }
}