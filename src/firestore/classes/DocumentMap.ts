import { DocumentParser, DocumentParserDefinition, DocumentParserListener } from "./DocumentParser"
import { DocumentDefine, EventDefine } from "../types/DefineTypes"

export interface DocumentMapDefineProps {
  define: DocumentDefine
  defineEvent: EventDefine
}
export abstract class DocumentMap extends DocumentParser {
  constructor() {
    super()
    this.definition({
      define: (propName, propType, defaultValue) => {
        const _definition = new DocumentParserDefinition(propName, propType, defaultValue)
        this._definitions.push(_definition)
        return _definition
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
  abstract definition({ define }: DocumentMapDefineProps): void
}