import type {
  CollectionReference as WebCollectionReference,
  DocumentData as WebDocumentData,
  DocumentReference as WebDocumentReference,
  DocumentSnapshot as WebDocumentSnapshot,
  SetOptions as WebSetOptions
} from "firebase/firestore"
import type {
  CollectionReference as AdminCollectionReference,
  DocumentData as AdminDocumentData,
  DocumentReference as AdminDocumentReference,
  DocumentSnapshot as AdminDocumentSnapshot,
  SetOptions as AdminSetOptions,
  WriteResult as AdminWriteResult
} from "firebase-admin/firestore"
import type {
  FirebaseFirestoreTypes
} from "@react-native-firebase/firestore"

export type ReactNativeCollectionReference<T extends FirebaseFirestoreTypes.DocumentData = FirebaseFirestoreTypes.DocumentData> = FirebaseFirestoreTypes.CollectionReference<T>
export type ReactNativeDocumentReference<T extends FirebaseFirestoreTypes.DocumentData = FirebaseFirestoreTypes.DocumentData> = FirebaseFirestoreTypes.DocumentReference<T>

export type DocumentData = WebDocumentData | AdminDocumentData | FirebaseFirestoreTypes.DocumentData
export type CollectionReference<T extends WebCollectionReference | AdminDocumentData | FirebaseFirestoreTypes.DocumentData = DocumentData> = WebCollectionReference<T> | AdminCollectionReference<T> | ReactNativeCollectionReference<T>
export type DocumentReference<T extends WebCollectionReference | AdminDocumentData | FirebaseFirestoreTypes.DocumentData = DocumentData> = WebDocumentReference<T> | AdminDocumentReference<T> | ReactNativeDocumentReference<T>
export type DocumentSnapshot<T extends WebCollectionReference | AdminDocumentData | FirebaseFirestoreTypes.DocumentData = DocumentData> = WebDocumentSnapshot<T> | AdminDocumentSnapshot<T> | FirebaseFirestoreTypes.DocumentSnapshot<T>
export type SetOptions = WebSetOptions | AdminSetOptions | FirebaseFirestoreTypes.SetOptions

export {
  WebCollectionReference,
  WebDocumentData,
  WebDocumentReference,
  WebDocumentSnapshot,
  WebSetOptions
}
export {
  AdminCollectionReference,
  AdminDocumentData,
  AdminDocumentReference,
  AdminDocumentSnapshot,
  AdminSetOptions,
  AdminWriteResult
}