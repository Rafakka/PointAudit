export type {
    Phase,
    TimeHm,
    DayRecord,
    JoinedUserContext,
    uploadResponse,

} from "../../../contracts"

import type { DayRecord } from "../../../contracts"

export interface PersonalData {
    meta : {
        schemaVersion:number
        extractedAt:string
        source:string
        userId:string
    }
    person: {
        name:string
        employeeId?:string
        role?: string
        department?:string
        company?:string
    }
}

export interface PersonalTimeData {
    meta : {
        schemaVersion:number
        extractedAt:string
        source:string
        userId:string
    }
    dias: Record<string, DayRecord>
}

export type MaskedPersonalData = {
    meta:PersonalData["meta"]
    person: {
        name:string
        employeeIdHash:string
        role?:string
        company?:string
    }
}

export type OutputType =
| "json"
| "csv"
| "pdf"

export type JsonArtifact = {
    name:string
    path:string
    size:number
    updatedAt:number
}