import type { TimeSheetData } from "./time"
import type { Phase } from "./phase"

export interface JobMeta {
    jobId: string
    extractedAt: string
    source:string
    schemaVersion: number
}

export interface PersonData {
    name:string
    employeeId?:string
    role?:string
    department?:string
    company?:string
}

export interface JobDocument {
    meta: JobMeta
    phase:Phase
    person:PersonData
    timesheet: TimeSheetData
}