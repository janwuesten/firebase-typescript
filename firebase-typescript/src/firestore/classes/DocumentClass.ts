import { addDoc, CollectionReference, deleteDoc, doc, getDoc, setDoc, SetOptions, updateDoc } from "firebase/firestore"
import { DocumentParser, DocumentParserDefinition, DocumentParserListener } from "./DocumentParser"
import { CollectionDefine, DocumentDefine, EventDefine } from "../types/DefineTypes"

export interface DocumentClassDefineProps {
    define: DocumentDefine
    defineCollection: CollectionDefine
    event: EventDefine
}
export abstract class DocumentClass extends DocumentParser {
    protected _id: string
    private _collectionDefinition: (() => CollectionReference) | null = null

    constructor(id: string = "") {
        super()
        this._id = id
        this.definition({
            define: (propName, propType) => {
                const _definition = new DocumentParserDefinition(propName, propType)
                this._definitions.push(_definition)
                return _definition
            },
            defineCollection: (collection) => {
                this._collectionDefinition = collection
            },
            event: (event, listener) => {
                switch (event) {
                    case "beforeWrite":
                        this._listeners.push(new DocumentParserListener(event, listener))
                        break
                    default:
                        throw new Error(`invalid_listener: ${event}`)
                }
            }
        })
    }
    abstract definition({ define, defineCollection }: DocumentClassDefineProps): void

    async update() {
        if (this._id) {
            await updateDoc(this.ref, this.toData() as Partial<unknown>)
        } else {
            throw new Error("called update without id")
        }
    }
    async set(options: SetOptions = { merge: true }) {
        if (this._id) {
            await setDoc(this.ref, this.toData(), options)
        } else {
            const addedDoc = await addDoc(this.collectionRef, this.toData())
            this._id = addedDoc.id
        }
    }
    async add() {
        if (this._id) {
            throw new Error("called add with id")
        } else {
            const addedDoc = await addDoc(this.collectionRef, this.toData())
            this._id = addedDoc.id
        }
    }
    async delete() {
        if (this._id) {
            await deleteDoc(this.ref)
        }
    }
    async get() {
        const doc = await getDoc(this.ref)
        if (!doc.exists) {
            return false
        }
        this.fromData(doc.data()!)
        return true
    }

    get id() {
        return this._id
    }
    get ref() {
        return doc(this.collectionRef, this._id)
    }
    get collectionRef(): CollectionReference {
        if (!this._collectionDefinition) {
            throw new Error("collection not defined. Define with defineCollection()")
        }
        return this._collectionDefinition()
    }
}