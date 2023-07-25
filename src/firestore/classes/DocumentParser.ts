import { Timestamp } from "firebase/firestore"
import { DocumentMap } from "./DocumentMap"
import { DocumentData, FieldType } from "../types/DocumentTypes"
import { EventDefineCallback } from "../types/DefineTypes"
import { Mappable } from "./Mappable"

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
  async toDocumentMapMappable(mappable: Mappable<DocumentParser>): Promise<Record<string, DocumentData> | null> {
    if (!mappable) {
      return null
    }
    const items: Record<string, DocumentData> = {}
    for (const [key, val] of Object.entries(Object.fromEntries(mappable))) {
      items[key] = await val.toData()
    }
    return items
  }
  async fromDocumentMapMappable<T extends DocumentMap>(data: DocumentData, generator: (data: DocumentData) => T): Promise<Mappable<T> | null> {
    if (!data) {
      return null
    }
    const items = new Mappable<T>()
    if (data) {
      for (const [key, val] of Object.entries(data)) {
        items.set(key, await generator(val as DocumentData).fromData(val as DocumentData))
      }
    }
    return items
  }
  async toDocumentMapSimpleMappable(mappable: Mappable<string | number | boolean | null>): Promise<Record<string, string | number | boolean | null> | null> {
    if (!mappable) {
      return null
    }
    const items: Record<string, string | number | boolean | null> = {}
    for (const [key, val] of Object.entries(Object.fromEntries(mappable))) {
      items[key] = val as string | number | boolean | null
    }
    return items
  }
  async fromDocumentMapSimpleMappable(data: DocumentData): Promise<Mappable<string | number | boolean | null> | null> {
    if (!data) {
      return null
    }
    const items = new Mappable<string | number | boolean | null>()
    if (data) {
      for (const [key, val] of Object.entries(data)) {
        items.set(key, val as string | number | boolean | null)
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
      if (!(definition._remoteField in data) || definition._remoteField == null) {
        const _defaultValue = definition._defaultValue
        if (typeof _defaultValue == "function") {
          self[definition._field] = _defaultValue()
        } else {
          self[definition._field] = _defaultValue
        }
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
          case "mappable":
            if (!definition._defineMap) {
              throw new Error(`map definition for field ${definition._field} missing. Define with .defineMap()`)
            }
            self[definition._field] = await this.fromDocumentMapMappable(data[definition._remoteField] as DocumentData, definition._defineMap!)
            break
          case "simpleMappable":
            self[definition._field] = await this.fromDocumentMapSimpleMappable(data[definition._remoteField] as DocumentData)
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
            case "mappable":
              data[definition._remoteField] = await this.toDocumentMapMappable(self[definition._field])
              break
            case "simpleMappable":
              data[definition._remoteField] = await this.toDocumentMapSimpleMappable(self[definition._field])
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