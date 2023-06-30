import { getFirestore } from "firebase-admin/firestore";
import { AddDocResult, AdminDocumentBatchHandler, AdminDocumentClassHandler, CollectionRefResult, CommitResult, DeleteDocResult, DocRefResult, DocumentData, GetDocResult, SetDocResult, UpdateDocResult } from "../src"
import { SetOptions, WriteBatch } from "../src/firestore/types/FirestoreTypes";

export class DocumentHandler implements AdminDocumentClassHandler {
  collection(name: string): CollectionRefResult {
    return getFirestore().collection(name)
  }
  getDoc(ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>): GetDocResult {
    return ref.get()
  }
  addDoc(collectionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>, data: Partial<unknown>): AddDocResult {
    return collectionRef.add(data)
  }
  setDoc(ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>, data: Partial<unknown>, options: SetOptions): SetDocResult {
    return ref.set(data, options)
  }
  updateDoc(ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>, data: Partial<unknown>): UpdateDocResult {
    return ref.update(data)
  }
  deleteDoc(ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>): DeleteDocResult {
    return ref.delete()
  }
  doc(ref: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>, id: string): DocRefResult {
    return ref.doc(id)
  }

}
export class BatchHandler implements AdminDocumentBatchHandler {
  create(): WriteBatch {
    return getFirestore().batch()
  }
  set(batch: FirebaseFirestore.WriteBatch, ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>, data: DocumentData): void {
    batch.set(ref, data)
  }
  update(batch: FirebaseFirestore.WriteBatch, ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>, data: DocumentData): void {
    batch.update(ref, data)
  }
  delete(batch: FirebaseFirestore.WriteBatch, ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>): void {
    batch.delete(ref)
  }
  commit(batch: FirebaseFirestore.WriteBatch): CommitResult {
    return batch.commit()
  }
  
}