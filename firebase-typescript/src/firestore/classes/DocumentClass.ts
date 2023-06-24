import { CollectionReference, SetOptions } from "firebase/firestore"
import { DocumentParser, DocumentParserDefinition, DocumentParserListener } from "./DocumentParser"
import { CollectionDefine, DocumentDefine, EventDefine, HandlerDefine } from "../types/DefineTypes"
import { DefaultDocumentClassHandler, DocumentClassHandler } from "./DocumentClassHandler"

export interface DocumentClassDefineProps {
    define: DocumentDefine
    defineCollection: CollectionDefine
    defineHandler: HandlerDefine,
    defineEvent: EventDefine
}
export abstract class DocumentClass extends DocumentParser {
    id: string
    private _collectionDefinition: (() => CollectionReference) | null = null
    private __handlerDefinition: DocumentClassHandler = new DefaultDocumentClassHandler()

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
            defineHandler: (handler) => {
                this.__handlerDefinition = handler
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
            await this.__handlerDefinition.updateDoc(this.ref, await this.toData() as Partial<unknown>)
        } else {
            throw new Error("called update without id")
        }
    }
    async set(options: SetOptions = {}) {
        if (this.id) {
            await this.__handlerDefinition.setDoc(this.ref, await this.toData(), options)
        } else {
            const addedDoc = await this.__handlerDefinition.addDoc(this.collectionRef, await this.toData())
            this.id = addedDoc.id
        }
    }
    async add() {
        if (this.id) {
            throw new Error("called add with id")
        } else {
            const addedDoc = await this.__handlerDefinition.addDoc(this.collectionRef, await this.toData())
            this.id = addedDoc.id
        }
    }
    async delete() {
        if (this.id) {
            await this.__handlerDefinition.deleteDoc(this.ref)
        }
    }
    async get() {
        const doc = await this.__handlerDefinition.getDoc(this.ref)
        if (!doc.exists) {
            return false
        }
        await this.fromData(doc.data()!)
        return true
    }

    get ref() {
        return this.__handlerDefinition.doc(this.collectionRef, this.id)
    }
    get collectionRef(): CollectionReference {
        if (!this._collectionDefinition) {
            throw new Error("collection not defined. Define with defineCollection()")
        }
        return this._collectionDefinition()
    }
}