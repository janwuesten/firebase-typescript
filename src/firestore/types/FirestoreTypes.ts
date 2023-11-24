export type FirestoreDocumentData = Partial<unknown>
export type CollectionReference = any
export type DocumentReference = any
export type DocumentSnapshot = any
export type SetOptions = {
  merge?: boolean,
  [key: string]: any
}
export type WriteBatch = any
export type WriteResult = any
export type QuerySnapshot = any
export type QueryDocumentSnapshot = any

// Legacy exports:
export type ReactNativeCollectionReference<T> = CollectionReference
export type ReactNativeDocumentReference<T> = DocumentReference
export type ReactNativeWriteBatch = WriteBatch
export type ReactNativeQuerySnapshot = QuerySnapshot
export type ReactNativeQueryDocumentSnapshot = QueryDocumentSnapshot

export type WebCollectionReference<T> = CollectionReference
export type WebDocumentData = FirestoreDocumentData
export type WebDocumentReference<T> = DocumentReference
export type WebDocumentSnapshot = DocumentSnapshot
export type WebSetOptions = SetOptions
export type WebWriteBatch = WriteBatch

export type AdminCollectionReference<T> = CollectionReference
export type AdminDocumentData = FirestoreDocumentData
export type AdminDocumentReference<T> = DocumentReference
export type AdminDocumentSnapshot = DocumentSnapshot
export type AdminSetOptions = SetOptions
export type AdminWriteBatch = WriteBatch