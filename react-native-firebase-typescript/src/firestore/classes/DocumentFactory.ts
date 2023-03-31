import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore"
import { DocumentData } from "../types/DocumentTypes"
import { DocumentClass } from "./DocumentClass"

export class DocumentFactory<T extends DocumentClass> {
    private __defineClass: ((id: string, data: DocumentData) => T)
    constructor(constructor: ((id: string, data: DocumentData) => T)) {
        this.__defineClass = constructor
    }
    async getDocs(query: FirebaseFirestoreTypes.Query) {
        const result = await query.get()
        const docs: T[] = []
        await Promise.all(result.docs.map(async (doc) => {
            const document = await this.__defineClass(doc.id, doc.data() as DocumentData).fromData(doc.data() as DocumentData)
            document.id = doc.id
            docs.push(document)
        }))
        return docs
    }
}