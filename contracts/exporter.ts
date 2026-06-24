

export type OutputType = 
    | "json"
    | "pdf"
    | "xlsx"

export interface ExportRequest {
    type: OutputType
}
