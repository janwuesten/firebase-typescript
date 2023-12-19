import { DocumentData } from "../types/DocumentTypes"
import { DocumentReference, WriteBatch } from "../types/FirestoreTypes"

export type CommitResult = Promise<unknown>
export interface DocumentBatchHandler {
  create(): WriteBatch
  set(batch: WriteBatch, ref: DocumentReference, data: DocumentData): void
  update(batch: WriteBatch, ref: DocumentReference, data: DocumentData): void
  delete(batch: WriteBatch, ref: DocumentReference): void
  commit(batch: WriteBatch): CommitResult
}
export interface WebDocumentBatchHandler extends DocumentBatchHandler {

}
export interface AdminDocumentBatchHandler extends DocumentBatchHandler {

}
export interface ReactNativeDocumentBatchHandler extends DocumentBatchHandler {

}