import { DocumentParser, DocumentParserDefinition, DocumentParserListener } from "./DocumentParser"
import { DocumentDefine, EventDefine } from "../types/DefineTypes"

export interface DocumentMapDefineProps {
    define: DocumentDefine
    event: EventDefine
}
export abstract class DocumentMap extends DocumentParser {
    constructor() {
        super()
        this.definition({
            define: (propName, propType) => {
                const _definition = new DocumentParserDefinition(propName, propType)
                this._definitions.push(_definition)
                return _definition
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
    abstract definition({ define }: DocumentMapDefineProps): void
}