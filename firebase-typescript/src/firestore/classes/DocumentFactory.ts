import { getDocs, Query, QueryDocumentSnapshot, DocumentSnapshot, QuerySnapshot } from "firebase/firestore"
import { DocumentData } from "../types/DocumentTypes"
import { DocumentClass } from "./DocumentClass"

export class DocumentFactory<T extends DocumentClass> {
    private __defineClass: ((id: string, data: DocumentData) => T)
    constructor(constructor: ((id: string, data: DocumentData) => T)) {
        this.__defineClass = constructor
    }
    async fromDocs(documents: QueryDocumentSnapshot<unknown>[]) {
        const docs: T[] = []
        await Promise.all(documents.map(async (doc) => {
            const document = await this.__defineClass(doc.id, doc.data() as DocumentData).fromData(doc.data() as DocumentData)
            document.id = doc.id
            docs.push(document)
        }))
        return docs
    }
    async fromSnapshot(snapshot: DocumentSnapshot) {
        if (!snapshot.exists()) {
            return null
        }
        return await this.__defineClass(snapshot.id, snapshot.data() as DocumentData).fromData(snapshot.data() as DocumentData)
    }
    async fromQuerySnapshot(snapshot: QuerySnapshot) {
        return await this.fromDocs(snapshot.docs)
    }
    async getDocs(query: Query<unknown>) {
        const result = await getDocs(query)
        return await this.fromDocs(result.docs)
    }
}