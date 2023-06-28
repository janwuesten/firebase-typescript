import { CollectionReference, DocumentData, DocumentReference, DocumentSnapshot, SetOptions, addDoc, deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export interface DocumentClassHandler {
  getDoc(ref: DocumentReference): Promise<DocumentSnapshot<DocumentData>>
  addDoc(collectionRef: CollectionReference, data: Partial<unknown>): Promise<DocumentReference<Partial<unknown>>>
  setDoc(ref: DocumentReference, data: Partial<unknown>, options: SetOptions): Promise<void>
  updateDoc(ref: DocumentReference, data: Partial<unknown>): Promise<void>
  deleteDoc(ref: DocumentReference): Promise<void>
  doc(ref: CollectionReference, id: string): DocumentReference<DocumentData>
}
export class DefaultDocumentClassHandler implements DocumentClassHandler {
  getDoc(ref: DocumentReference<DocumentData>): Promise<DocumentSnapshot<DocumentData>> {
    return getDoc(ref)
  }
  addDoc(collectionRef: CollectionReference<DocumentData>, data: Partial<unknown>): Promise<DocumentReference<Partial<unknown>>> {
    return addDoc(collectionRef, data)
  }
  setDoc(ref: DocumentReference<DocumentData>, data: Partial<unknown>, options: SetOptions): Promise<void> {
    return setDoc(ref, data, options)
  }
  updateDoc(ref: DocumentReference<DocumentData>, data: Partial<unknown>): Promise<void> {
    return updateDoc(ref, data)
  }
  deleteDoc(ref: DocumentReference<DocumentData>): Promise<void> {
    return deleteDoc(ref)
  }
  doc(ref: CollectionReference<DocumentData>, id: string): DocumentReference<DocumentData> {
    return doc(ref, id)
  }

}