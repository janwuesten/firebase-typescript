import { DocumentData } from "../types/DocumentTypes"
import { AdminDocumentReference, AdminWriteBatch, DocumentReference, ReactNativeDocumentReference, ReactNativeWriteBatch, WebDocumentReference, WebWriteBatch, WriteBatch } from "../types/FirestoreTypes"

export type CommitResult = Promise<unknown>
export interface DocumentBatchHandler<WB extends WriteBatch, DR extends DocumentReference> {
  create(): WriteBatch
  set(batch: WB, ref: DR, data: DocumentData): void
  update(batch: WB, ref: DR, data: DocumentData): void
  delete(batch: WB, ref: DR): void
  commit(batch: WB): CommitResult
}
export interface WebDocumentBatchHandler extends DocumentBatchHandler<WebWriteBatch, WebDocumentReference> {

}
export interface AdminDocumentBatchHandler extends DocumentBatchHandler<AdminWriteBatch, AdminDocumentReference> {

}
export interface ReactNativeDocumentBatchHandler extends DocumentBatchHandler<ReactNativeWriteBatch, ReactNativeDocumentReference> {

}