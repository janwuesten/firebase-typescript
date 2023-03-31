import { getFirestore, WriteBatch, WriteResult } from "firebase-admin/firestore"
import { DocumentClass } from "./DocumentClass"

export interface DocumentBatchOptions {
    split?: boolean
}
export class DocumentBatch {
    private _options: DocumentBatchOptions = {
        split: false
    }
    private _lastBatch: WriteBatch
    private _lastBatchActions: number
    private _maxBatchActions = 500
    private _transactions: Promise<WriteResult[]>[] = []

    
    constructor(options?: DocumentBatchOptions) {
        this._lastBatch = getFirestore().batch()
        this._lastBatchActions = 0
        if (options) {
            this._options = options
        }
    }
    private _getBatch() {
        if (this._lastBatchActions >= this._maxBatchActions) {
            if (this._options.split) {
                this._transactions.push(this._lastBatch.commit())
                this._lastBatch = getFirestore().batch()
                this._lastBatchActions = 0
            } else {
                throw new Error("max_batch_actions")
            }
        }
        this._lastBatchActions++
        return this._lastBatch
    }
    async set(document: DocumentClass) {
        const batch = this._getBatch()
        batch.set(document.ref, await document.toData())
    }
    async delete(document: DocumentClass) {
        const batch = this._getBatch()
        batch.delete(document.ref)
    }
    async update(document: DocumentClass) {
        const batch = this._getBatch()
        batch.update(document.ref, await document.toData() as Partial<unknown>)
    }
    async commit() {
        this._transactions.push(this._lastBatch.commit())
        await Promise.all(this._transactions)
    }
}