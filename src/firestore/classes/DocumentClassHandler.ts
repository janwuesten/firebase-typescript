import {
  DocumentReference,
  DocumentSnapshot,
  CollectionReference,
  SetOptions,
  WriteBatch,
  WriteResult,
  FirestoreDocumentData
} from "../types/FirestoreTypes"

export type CollectionRefResult = CollectionReference
export type GetDocResult = Promise<DocumentSnapshot>
export type AddDocResult = Promise<DocumentReference>
export type SetDocResult = Promise<WriteResult>
export type UpdateDocResult = Promise<WriteResult>
export type DeleteDocResult = Promise<WriteResult>
export type DocRefResult = DocumentReference
export type BatchResult = WriteBatch

export interface DocumentClassHandler {
  collection(name: string): CollectionRefResult
  getDoc(ref: DocumentReference): GetDocResult
  addDoc(collectionRef: CollectionReference, data: FirestoreDocumentData): AddDocResult
  setDoc(ref: DocumentReference, data: FirestoreDocumentData, options: SetOptions): SetDocResult
  updateDoc(ref: DocumentReference, data: FirestoreDocumentData): UpdateDocResult
  deleteDoc(ref: DocumentReference): DeleteDocResult
  doc(ref: CollectionReference, id: string): DocRefResult
}

// Legacy exports:
export interface WebDocumentClassHandler extends DocumentClassHandler {

}
export interface AdminDocumentClassHandler extends DocumentClassHandler {

}
export interface ReactNativeDocumentClassHandler extends DocumentClassHandler {

}