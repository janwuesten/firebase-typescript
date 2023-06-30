import type {
  CollectionReference as WebCollectionReference,
  DocumentData as WebDocumentData,
  DocumentReference as WebDocumentReference,
  DocumentSnapshot as WebDocumentSnapshot,
  SetOptions as WebSetOptions,
  WriteBatch as WebWriteBatch,
  QuerySnapshot as WebQuerySnapshot,
  QueryDocumentSnapshot as WebQueryDocumentSnapshot
} from "firebase/firestore"
import type {
  CollectionReference as AdminCollectionReference,
  DocumentData as AdminDocumentData,
  DocumentReference as AdminDocumentReference,
  DocumentSnapshot as AdminDocumentSnapshot,
  SetOptions as AdminSetOptions,
  WriteResult as AdminWriteResult,
  WriteBatch as AdminWriteBatch,
  QuerySnapshot as AdminQuerySnapshot,
  QueryDocumentSnapshot as AdminQueryDocumentSnapshot
} from "firebase-admin/firestore"
import type {
  FirebaseFirestoreTypes
} from "@react-native-firebase/firestore"

export type ReactNativeCollectionReference<T extends FirebaseFirestoreTypes.DocumentData = FirebaseFirestoreTypes.DocumentData> = FirebaseFirestoreTypes.CollectionReference<T>
export type ReactNativeDocumentReference<T extends FirebaseFirestoreTypes.DocumentData = FirebaseFirestoreTypes.DocumentData> = FirebaseFirestoreTypes.DocumentReference<T>
export type ReactNativeWriteBatch = FirebaseFirestoreTypes.WriteBatch
export type ReactNativeQuerySnapshot = FirebaseFirestoreTypes.QuerySnapshot
export type ReactNativeQueryDocumentSnapshot<T extends FirebaseFirestoreTypes.DocumentData = FirebaseFirestoreTypes.DocumentData> = FirebaseFirestoreTypes.QueryDocumentSnapshot<T>

export type DocumentData = WebDocumentData | AdminDocumentData | FirebaseFirestoreTypes.DocumentData
export type CollectionReference<T extends WebDocumentData | AdminDocumentData | FirebaseFirestoreTypes.DocumentData = DocumentData> = WebCollectionReference<T> | AdminCollectionReference<T> | ReactNativeCollectionReference<T>
export type DocumentReference<T extends WebDocumentData | AdminDocumentData | FirebaseFirestoreTypes.DocumentData = DocumentData> = WebDocumentReference<T> | AdminDocumentReference<T> | ReactNativeDocumentReference<T>
export type DocumentSnapshot<T extends WebDocumentData | AdminDocumentData | FirebaseFirestoreTypes.DocumentData = DocumentData> = WebDocumentSnapshot<T> | AdminDocumentSnapshot<T> | FirebaseFirestoreTypes.DocumentSnapshot<T>
export type SetOptions = WebSetOptions | AdminSetOptions | FirebaseFirestoreTypes.SetOptions
export type WriteBatch = WebWriteBatch | AdminWriteBatch | ReactNativeWriteBatch
export type QuerySnapshot = WebQuerySnapshot | AdminQuerySnapshot | ReactNativeQuerySnapshot
export type QueryDocumentSnapshot<T extends WebDocumentData | AdminDocumentData | FirebaseFirestoreTypes.DocumentData = DocumentData> = WebQueryDocumentSnapshot<T> | AdminQueryDocumentSnapshot<T> | ReactNativeQueryDocumentSnapshot<T>

export {
  WebCollectionReference,
  WebDocumentData,
  WebDocumentReference,
  WebDocumentSnapshot,
  WebSetOptions,
  WebWriteBatch
}
export {
  AdminCollectionReference,
  AdminDocumentData,
  AdminDocumentReference,
  AdminDocumentSnapshot,
  AdminSetOptions,
  AdminWriteResult,
  AdminWriteBatch
}