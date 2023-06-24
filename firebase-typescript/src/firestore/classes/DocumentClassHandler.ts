import { CollectionReference, DocumentData, DocumentReference, DocumentSnapshot, SetOptions } from "firebase/firestore";

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
    throw new Error("Method not implemented.");
  }
  addDoc(collectionRef: CollectionReference<DocumentData>, data: Partial<unknown>): Promise<DocumentReference<Partial<unknown>>> {
    throw new Error("Method not implemented.");
  }
  setDoc(ref: DocumentReference<DocumentData>, data: Partial<unknown>, options: SetOptions): Promise<void> {
    throw new Error("Method not implemented.");
  }
  updateDoc(ref: DocumentReference<DocumentData>, data: Partial<unknown>): Promise<void> {
    throw new Error("Method not implemented.");
  }
  deleteDoc(ref: DocumentReference<DocumentData>): Promise<void> {
    throw new Error("Method not implemented.");
  }
  doc(ref: CollectionReference<DocumentData>, id: string): DocumentReference<DocumentData> {
    throw new Error("Method not implemented.");
  }

}