import { getFirestore } from "firebase-admin/firestore";
import {
  AdminDocumentBatchHandler,
  AdminDocumentClassHandler,
  AdminWriteBatch,
  AdminDocumentData,
  AdminDocumentReference,
  AdminCollectionReference,
  AdminSetOptions
} from "../src"

export class DocumentHandler implements AdminDocumentClassHandler {
  collection(name: string) {
    return getFirestore().collection(name)
  }
  getDoc(ref: AdminDocumentReference<AdminDocumentData>) {
    return ref.get()
  }
  addDoc(collectionRef: AdminCollectionReference<AdminDocumentData>, data: Partial<unknown>) {
    return collectionRef.add(data)
  }
  setDoc(ref: AdminDocumentReference<AdminDocumentData>, data: Partial<unknown>, options: AdminSetOptions) {
    return ref.set(data, options)
  }
  updateDoc(ref: AdminDocumentReference<AdminDocumentData>, data: Partial<unknown>) {
    return ref.update(data)
  }
  deleteDoc(ref: AdminDocumentReference<AdminDocumentData>) {
    return ref.delete()
  }
  doc(ref: AdminCollectionReference<AdminDocumentData>, id: string) {
    return ref.doc(id)
  }
}
export class BatchHandler implements AdminDocumentBatchHandler {
  create() {
    return getFirestore().batch()
  }
  set(batch: AdminWriteBatch, ref: AdminDocumentReference<AdminDocumentData>, data: AdminDocumentData) {
    batch.set(ref, data)
  }
  update(batch: AdminWriteBatch, ref: AdminDocumentReference<AdminDocumentData>, data: AdminDocumentData) {
    batch.update(ref, data)
  }
  delete(batch: AdminWriteBatch, ref: AdminDocumentReference<AdminDocumentData>) {
    batch.delete(ref)
  }
  commit(batch: AdminWriteBatch) {
    return batch.commit()
  }
}