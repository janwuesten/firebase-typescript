import { CollectionReference, DocumentData, SetOptions } from "firebase-admin/firestore"
import { DocumentParser, DocumentParserDefinition, DocumentParserListener } from "./DocumentParser"
import { CollectionDefine, DocumentDefine, EventDefine } from "../types/DefineTypes"

export interface DocumentClassDefineProps {
    define: DocumentDefine
    defineCollection: CollectionDefine
    defineEvent: EventDefine
}
export abstract class DocumentClass extends DocumentParser {
    id: string
    private _collectionDefinition: (() => CollectionReference<DocumentData>) | null = null

    constructor(id: string = "") {
        super()
        this.id = id
        this.definition({
            define: (propName, propType) => {
                const _definition = new DocumentParserDefinition(propName, propType)
                this._definitions.push(_definition)
                return _definition
            },
            defineCollection: (collection) => {
                this._collectionDefinition = collection
            },
            defineEvent: (event, listener) => {
                switch (event) {
                    case "beforeWrite":
                    case "afterWrite":
                    case "afterRead":
                    case "beforeRead":
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
        if (this.id) {
            await this.ref.update(await this.toData())
        } else {
            throw new Error("called update without id")
        }
    }
    async set(options: SetOptions = { merge: true }) {
        if (this.id) {
            await this.ref.set(await this.toData(), options)
        } else {
            const addedDoc = await this.collectionRef.add(await this.toData())
            this.id = addedDoc.id
        }
    }
    async add() {
        if (this.id) {
            throw new Error("called add with id")
        } else {
            const addedDoc = await this.collectionRef.add(await this.toData())
            this.id = addedDoc.id
        }
    }
    async delete() {
        if (this.id) {
            await this.ref.delete()
        }
    }
    async get() {
        const doc = await this.ref.get()
        if (!doc.exists) {
            return false
        }
        await this.fromData(doc.data()!)
        return true
    }

    get ref() {
        return this.collectionRef.doc(this.id)
    }
    get collectionRef(): CollectionReference<DocumentData> {
        if (!this._collectionDefinition) {
            throw new Error("collection not defined. Define with defineCollection()")
        }
        return this._collectionDefinition()
    }
}