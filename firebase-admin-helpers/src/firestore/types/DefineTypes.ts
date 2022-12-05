import type * as admin from "firebase-admin"
import { DocumentParserDefinition } from "../classes/DocumentParser"
import { FieldType } from "./DocumentTypes"

export type DocumentDefine = (field: string, type: FieldType) => DocumentParserDefinition
export type CollectionDefine = (collection: () => admin.firestore.CollectionReference<admin.firestore.DocumentData>) => void