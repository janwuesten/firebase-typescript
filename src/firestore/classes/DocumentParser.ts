import { DocumentMap } from "./DocumentMap"
import { DocumentData } from "../types/DocumentTypes"
import { DocumentParserDefinitionGetter, DocumentParserDefinitionSetter, EventDefineCallback } from "../types/DefineTypes"
import { Mappable } from "./Mappable"

export class DocumentParserListener {
  event: string
  listener: EventDefineCallback

  constructor(event: string, listener: EventDefineCallback) {
    this.event = event
    this.listener = listener
  }
}
export class DocumentParserDefinition<A, B> {
  private __propertieName: string
  private __getter: DocumentParserDefinitionGetter<A>
  private __setter: DocumentParserDefinitionSetter<B>

  constructor(propertieName: string, getter: DocumentParserDefinitionGetter<A>, setter: DocumentParserDefinitionSetter<B>) {
    this.__getter = getter
    this.__setter = setter
    this.__propertieName = propertieName
  }
  
  get _propertieName() {
    return this.__propertieName
  }
  get _getter() {
    return this.__getter
  }
  get _setter() {
    return this.__setter
  }
}
export abstract class DocumentParser {
  protected _definitions: DocumentParserDefinition<any, any>[] = []
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
    const beforeReadListeners = this._listeners.filter((a) => a.event == "beforeRead")
    await Promise.all(beforeReadListeners.map(async (listener) => {
      await listener.listener()
    }))
    await Promise.all(this._definitions.map(async (definition) => {
      if (definition._propertieName in data) {
        await definition._getter(data[definition._propertieName])
      } else {
        await definition._getter(null)
      }
    }))
    const afterReadListeners = this._listeners.filter((a) => a.event == "afterRead")
    await Promise.all(afterReadListeners.map(async (listener) => {
      await listener.listener()
    }))
    return this
  }
  async toData(): Promise<DocumentData> {
    const data: DocumentData = {}
    const beforeWriteListeners = this._listeners.filter((a) => a.event == "beforeWrite")
    await Promise.all(beforeWriteListeners.map(async (listener) => {
      await listener.listener()
    }))
    await Promise.all(this._definitions.map(async (definition) => {
      data[definition._propertieName] = await definition._setter()
    }))
    const afterWriteListeners = this._listeners.filter((a) => a.event == "afterWrite")
    await Promise.all(afterWriteListeners.map(async (listener) => {
      await listener.listener()
    }))
    return data
  }
}