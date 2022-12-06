import { CollectionReference } from "firebase/firestore"
import { DocumentParserDefinition } from "../classes/DocumentParser"
import { FieldType } from "./DocumentTypes"

export type DocumentDefine = (field: string, type: FieldType) => DocumentParserDefinition
export type CollectionDefine = (collection: () => CollectionReference) => void