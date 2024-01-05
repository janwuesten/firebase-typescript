import { DocumentParserDefinition } from "../classes/DocumentParser"
import { DocumentClassHandler } from "../classes/DocumentClassHandler"
import { CollectionReference } from "./FirestoreTypes"

export type DocumentParserDefinitionGetter<T> = ((data: T | null) => void) | ((data: T | null) => Promise<void>)
export type DocumentParserDefinitionSetter<T> = (() => T) | (() => Promise<T>)
export type DocumentDefine = <A, B>(field: string, getter: DocumentParserDefinitionGetter<A>, setter: DocumentParserDefinitionSetter<B>) => DocumentParserDefinition<A, B>
export type CollectionDefine = (collection: () => CollectionReference) => void
export type HandlerDefine = (handler: DocumentClassHandler) => void
export type EventDefineCallback = (() => void) | (() => Promise<void>)
export type EventDefine = (event: "beforeWrite" | "afterWrite" | "beforeRead" | "afterRead", callback: EventDefineCallback) => void