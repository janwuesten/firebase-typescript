import { DocumentParser, DocumentParserDefinition } from "./DocumentParser"
import { DocumentDefine } from "../types/DefineTypes"

export interface DocumentMapDefineProps {
    define: DocumentDefine
}
export abstract class DocumentMap extends DocumentParser {
    constructor() {
        super()
        this.definition({
            define: (propName, propType) => {
                const _definition = new DocumentParserDefinition(propName, propType)
                this._definitions.push(_definition)
                return _definition
            }
        })
    }
    abstract definition({ define }: DocumentMapDefineProps): void
}