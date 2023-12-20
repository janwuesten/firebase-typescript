import { DocumentParser, DocumentParserDefinition, DocumentParserListener } from "./DocumentParser"
import { CollectionDefine, DocumentDefine, EventDefine, HandlerDefine } from "../types/DefineTypes"
import { DocumentClassHandler } from "./DocumentClassHandler"
import { CollectionReference, SetOptions } from "../types/FirestoreTypes"

export interface DocumentClassDefineProps {
  define: DocumentDefine
  defineCollection: CollectionDefine
  defineHandler: HandlerDefine,
  defineEvent: EventDefine
}
export abstract class DocumentClass extends DocumentParser {
  id: string
  private _collectionDefinition: (() => CollectionReference) | null = null
  private __handlerDefinition: DocumentClassHandler | null = null

  constructor(id: string = "") {
    super()
    this.id = id
    this.definition({
      define: (propName, propType, defaultValue) => {
        const _definition = new DocumentParserDefinition(propName, propType, defaultValue)
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
    const self = this as any
    for (const definition of this._definitions) {
      const _defaultValue = definition._defaultValue
        if (typeof _defaultValue == "function") {
          self[definition._field] = _defaultValue()
        } else {
          self[definition._field] = _defaultValue
        }
    }
  }
  abstract definition({ define, defineCollection, defineHandler }: DocumentClassDefineProps): void

  async update() {
    if (!this.__handlerDefinition) {
      throw new Error("handler not defined. Define with defineHandler()")
    }
    if (this.id) {
      await this.__handlerDefinition.updateDoc(this.ref, await this.toData() as Partial<unknown>)
    } else {
      throw new Error("called update without id")
    }
  }
  async set(options: SetOptions = {}) {
    if (!this.__handlerDefinition) {
      throw new Error("handler not defined. Define with defineHandler()")
    }
    if (this.id) {
      await this.__handlerDefinition.setDoc(this.ref, await this.toData(), options)
    } else {
      const addedDoc = await this.__handlerDefinition.addDoc(this.collectionRef, await this.toData())
      this.id = addedDoc.id
    }
  }
  async add() {
    if (!this.__handlerDefinition) {
      throw new Error("handler not defined. Define with defineHandler()")
    }
    if (this.id) {
      throw new Error("called add with id")
    } else {
      const addedDoc = await this.__handlerDefinition.addDoc(this.collectionRef, await this.toData())
      this.id = addedDoc.id
    }
  }
  async delete() {
    if (!this.__handlerDefinition) {
      throw new Error("handler not defined. Define with defineHandler()")
    }
    if (this.id) {
      await this.__handlerDefinition.deleteDoc(this.ref)
    }
  }
  async get() {
    if (!this.__handlerDefinition) {
      throw new Error("handler not defined. Define with defineHandler()")
    }
    const doc = await this.__handlerDefinition.getDoc(this.ref)
    if (typeof doc.exists == "function" ? !doc.exists() : !doc.exists) {
      return false
    }
    await this.fromData(doc.data() ?? {})
    return true
  }

  get ref() {
    if (!this.__handlerDefinition) {
      throw new Error("handler not defined. Define with defineHandler()")
    }
    return this.__handlerDefinition.doc(this.collectionRef, this.id)
  }
  get collectionRef(): CollectionReference {
    if (!this._collectionDefinition) {
      throw new Error("collection not defined. Define with defineCollection()")
    }
    return this._collectionDefinition()
  }
  
  withTransaction(transaction: any) {
    const _self = this
    return {
      async get(): Promise<boolean>  {
        if (!_self.__handlerDefinition || !_self.__handlerDefinition.transactionGet) {
          throw new Error("transaction handler not defined. Define with defineHandler()")
        }
        const doc = await _self.__handlerDefinition.transactionGet(transaction, _self.ref)
        if (typeof doc.exists == "function" ? !doc.exists() : !doc.exists) {
          return false
        }
        await _self.fromData(doc.data() ?? {})
        return true
      },
      delete<T>(): T {
        if (!_self.__handlerDefinition || !_self.__handlerDefinition.transactionDelete) {
          throw new Error("transaction handler not defined. Define with defineHandler()")
        }
        return _self.__handlerDefinition.transactionDelete(transaction, _self.ref)
      },
      async create<T>(): Promise<T> {
        if (!_self.__handlerDefinition || !_self.__handlerDefinition.transactionCreate) {
          throw new Error("transaction handler not defined. Define with defineHandler()")
        }
        return _self.__handlerDefinition.transactionCreate(transaction, _self.ref, await _self.toData())
      },
      async set<T>(options: SetOptions = {}): Promise<T> {
        if (!_self.__handlerDefinition || !_self.__handlerDefinition.transactionSet) {
          throw new Error("transaction handler not defined. Define with defineHandler()")
        }
        return _self.__handlerDefinition.transactionSet(transaction, _self.ref, await _self.toData(), options)
      },
      async update<T>(): Promise<T> {
        if (!_self.__handlerDefinition || !_self.__handlerDefinition.transactionUpdate) {
          throw new Error("transaction handler not defined. Define with defineHandler()")
        }
        return _self.__handlerDefinition.transactionUpdate(transaction, _self.ref, await _self.toData())
      }
    }
  }
}