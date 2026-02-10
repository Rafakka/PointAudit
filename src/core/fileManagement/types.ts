
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

export interface TimeHm {
    h:number
    m:number
}

export interface DayRecord {
    date:string
    weekday:string
    saldoPositivo?: TimeHm
    previsto:TimeHm[]
    realizado:TimeHm[]
    atrasos?: TimeHm
    observacao: string
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

export interface JoinedUserContext {
    meta:{
        userId:string
        source:string
        extractedAt:string
        schemaVersions: {
            personal:number
            timesheet: number
        }
    }
    person :{
        name:string
        emplyeeIdHash:string
        role?:string
        company?:string
    }
    timesheet : {
        days:Record<string,
        {
            date:string
            weekday:string
            previsto: {h:number, m:number}[]
            realizado:{h:number, m:number}[]
            saldoPositivo?:{h:number, m:number}
            atraso?:{h:number, m:number}
            observacao:string
        }>
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

