import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore"
import { DocumentData } from "../types/DocumentTypes"
import { DocumentClass } from "./DocumentClass"

export class DocumentFactory<T extends DocumentClass> {
    private __defineClass: ((id: string, data: DocumentData) => T)
    constructor(constructor: ((id: string, data: DocumentData) => T)) {
        this.__defineClass = constructor
    }
    async fromDocs(documents: FirebaseFirestoreTypes.QueryDocumentSnapshot[]) {
        const docs: T[] = []
        await Promise.all(documents.map(async (doc) => {
            const document = await this.__defineClass(doc.id, doc.data() as DocumentData).fromData(doc.data() as DocumentData)
            document.id = doc.id
            docs.push(document)
        }))
        return docs
    }
    async fromSnapshot(snapshot: FirebaseFirestoreTypes.DocumentSnapshot) {
        if (!snapshot.exists) {
            return null
        }
        const doc = await this.__defineClass(snapshot.id, snapshot.data() as DocumentData).fromData(snapshot.data() as DocumentData)
        doc.id = snapshot.id
        return doc
    }
    async fromQuerySnapshot(snapshot: FirebaseFirestoreTypes.QuerySnapshot) {
        return await this.fromDocs(snapshot.docs)
    }
    async getDocs(query: FirebaseFirestoreTypes.Query) {
        const result = await query.get()
        return await this.fromDocs(result.docs)
    }
}