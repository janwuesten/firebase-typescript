import { getFirestore, Transaction, CollectionReference, DocumentReference, WriteBatch, SetOptions } from "firebase-admin/firestore";
import {
  DocumentBatchHandler,
  DocumentClassHandler,
  DocumentData
} from "../src"


export class DocumentHandler implements DocumentClassHandler {
  collection(name: string) {
    return getFirestore().collection(name)
  }
  getDoc(ref: DocumentReference) {
    return ref.get()
  }
  addDoc(collectionRef: CollectionReference, data: Partial<unknown>) {
    return collectionRef.add(data)
  }
  setDoc(ref: DocumentReference, data: Partial<unknown>, options: SetOptions) {
    return ref.set(data, options)
  }
  updateDoc(ref: DocumentReference, data: Partial<unknown>) {
    return ref.update(data)
  }
  deleteDoc(ref: DocumentReference) {
    return ref.delete()
  }
  doc(ref: CollectionReference, id: string) {
    return ref.doc(id)
  }

  transactionCreate(transaction: Transaction, ref: any, data: Partial<unknown>) {
    return transaction.create(ref, data)
  }
  transactionDelete(transaction: Transaction, ref: any) {
    return transaction.delete(ref)
  }
  transactionGet(transaction: Transaction, ref: any) {
    return transaction.get(ref)
  }
  transactionSet(transaction: Transaction, ref: any, data: Partial<unknown>, options: SetOptions) {
    return transaction.set(ref, data, options)
  }
  transactionUpdate(transaction: Transaction, ref: any, data: Partial<unknown>) {
    return transaction.update(ref, data)
  }
}
export class BatchHandler implements DocumentBatchHandler {
  create() {
    return getFirestore().batch()
  }
  set(batch: WriteBatch, ref: DocumentReference, data: DocumentData) {
    batch.set(ref, data)
  }
  update(batch: WriteBatch, ref: DocumentReference, data: DocumentData) {
    batch.update(ref, data)
  }
  delete(batch: WriteBatch, ref: DocumentReference) {
    batch.delete(ref)
  }
  commit(batch: WriteBatch) {
    return batch.commit()
  }
}