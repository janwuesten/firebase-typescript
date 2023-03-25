import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore"
import { DocumentParserDefinition } from "../classes/DocumentParser"
import { FieldType } from "./DocumentTypes"

export type DocumentDefine = (field: string, type: FieldType) => DocumentParserDefinition
export type CollectionDefine = (collection: () => FirebaseFirestoreTypes.CollectionReference) => void
export type EventDefineCallback = () => void
export type EventDefine = (event: "beforeWrite" | "afterWrite" | "beforeRead" | "afterRead", callback: EventDefineCallback) => void