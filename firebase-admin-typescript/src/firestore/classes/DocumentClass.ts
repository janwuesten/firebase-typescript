import type * as admin from "firebase-admin"
import { DocumentParser, DocumentParserDefinition } from "./DocumentParser"
import { CollectionDefine, DocumentDefine } from "../types/DefineTypes"

export interface DocumentClassDefineProps {
    define: DocumentDefine
    defineCollection: CollectionDefine
}
export abstract class DocumentClass extends DocumentParser {
    protected _id: string
    private _collectionDefinition: (() => admin.firestore.CollectionReference<admin.firestore.DocumentData>) | null = null

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
            }
        })
    }
    abstract definition({ define, defineCollection }: DocumentClassDefineProps): void

    async update() {
        if (this._id) {
            await this.ref.update(await this.toData())
        } else {
            throw new Error("called update without id")
        }
    }
    async set() {
        if (this._id) {
            await this.ref.set(await this.toData(), { merge: true })
        } else {
            const addedDoc = await this.collectionRef.add(await this.toData())
            this._id = addedDoc.id
        }
    }
    async add() {
        if (this._id) {
            throw new Error("called add with id")
        } else {
            const addedDoc = await this.collectionRef.add(await this.toData())
            this._id = addedDoc.id
        }
    }
    async delete() {
        if (this._id) {
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

    get id() {
        return this._id
    }
    get ref() {
        return this.collectionRef.doc(this._id)
    }
    get collectionRef(): admin.firestore.CollectionReference<admin.firestore.DocumentData> {
        if (!this._collectionDefinition) {
            throw new Error("collection not defined. Define with defineCollection()")
        }
        return this._collectionDefinition()
    }
}