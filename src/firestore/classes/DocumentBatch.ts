import { DocumentReference, WriteBatch } from "../types/FirestoreTypes"
import { DocumentBatchHandler } from "./DocumentBatchHandler"
import { DocumentClass } from "./DocumentClass"

export interface DocumentBatchOptions {
  split?: boolean
}
export class DocumentBatch {
  private _options: DocumentBatchOptions = {
    split: false
  }
  private _handler: DocumentBatchHandler<WriteBatch, DocumentReference>
  private _lastBatch: WriteBatch
  private _lastBatchActions: number
  private _maxBatchActions = 500
  private _transactions: Promise<unknown>[] = []


  constructor(handler: DocumentBatchHandler<WriteBatch, DocumentReference>, options?: DocumentBatchOptions) {
    this._handler = handler
    this._lastBatch = this._handler.create()
    this._lastBatchActions = 0
    if (options) {
      this._options = options
    }
  }
  private _getBatch() {
    if (this._lastBatchActions >= this._maxBatchActions) {
      if (this._options.split) {
        this._transactions.push(this._lastBatch.commit())
        this._lastBatch = this._handler.create()
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
    this._handler.set(batch, document.ref, await document.toData())
  }
  async delete(document: DocumentClass) {
    const batch = this._getBatch()
    this._handler.delete(batch, document.ref)
  }
  async update(document: DocumentClass) {
    const batch = this._getBatch()
    this._handler.update(batch, document.ref, await document.toData())
  }
  async commit() {
    this._transactions.push(this._handler.commit(this._lastBatch))
    await Promise.all(this._transactions)
  }
}