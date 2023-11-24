import { DocumentParserDefinition } from "../classes/DocumentParser"
import { FieldType } from "./DocumentTypes"
import { CollectionRefResult, DocumentClassHandler } from "../classes/DocumentClassHandler"
import { CollectionReference, DocumentReference } from "./FirestoreTypes"

export type DocumentDefine = <T>(field: string, type: FieldType, defaultValue?: T) => DocumentParserDefinition<T>
export type CollectionDefine = (collection: () => CollectionReference) => void
export type HandlerDefine = (handler: DocumentClassHandler<DocumentReference, CollectionRefResult>) => void
export type EventDefineCallback = (() => void) | (() => Promise<void>)
export type EventDefine = (event: "beforeWrite" | "afterWrite" | "beforeRead" | "afterRead", callback: EventDefineCallback) => void