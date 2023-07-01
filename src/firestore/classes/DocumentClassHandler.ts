import {
  FirestoreDocumentData,
  DocumentReference,
  DocumentSnapshot,
  CollectionReference,
  SetOptions,
  WebDocumentReference,
  WebCollectionReference,
  AdminDocumentReference,
  AdminCollectionReference,
  AdminWriteResult,
  ReactNativeDocumentReference,
  ReactNativeCollectionReference,
  WriteBatch
} from "../types/FirestoreTypes"

export type CollectionRefResult = CollectionReference
export type GetDocResult = Promise<DocumentSnapshot<FirestoreDocumentData>>
export type AddDocResult = Promise<DocumentReference<Partial<unknown>>>
export type SetDocResult = Promise<void> | Promise<AdminWriteResult>
export type UpdateDocResult = Promise<void> | Promise<AdminWriteResult>
export type DeleteDocResult = Promise<void> | Promise<AdminWriteResult>
export type DocRefResult = DocumentReference<FirestoreDocumentData>
export type BatchResult = WriteBatch

export interface DocumentClassHandler<DR extends DocumentReference, CR extends CollectionReference> {
  collection(name: string): CollectionRefResult
  getDoc(ref: DR): GetDocResult
  addDoc(collectionRef: CR, data: Partial<unknown>): AddDocResult
  setDoc(ref: DR, data: Partial<unknown>, options: SetOptions): SetDocResult
  updateDoc(ref: DR, data: Partial<unknown>): UpdateDocResult
  deleteDoc(ref: DR): DeleteDocResult
  doc(ref: CR, id: string): DocRefResult
}
export interface WebDocumentClassHandler extends DocumentClassHandler<WebDocumentReference, WebCollectionReference> {

}
export interface AdminDocumentClassHandler extends DocumentClassHandler<AdminDocumentReference, AdminCollectionReference> {

}
export interface ReactNativeDocumentClassHandler extends DocumentClassHandler<ReactNativeDocumentReference, ReactNativeCollectionReference> {

}