

export type PersonalMeta = {
  nome: string
  userId: string
  source: string
}

export type PersonalData = {
  meta: PersonalMeta
}

export type TimeEntry = {
  data: string
  horas: string
}

export type TimeSheetData = {
  meta: PersonalMeta
  dias: TimeEntry[]
}

export type ExtractedData = {
  personal: PersonalData
  timesheet: TimeSheetData
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
        dias:Record<string,
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

export type Phase =
| "ingested"
| "extracted"
| "confirmed"
| "finalized"

export type uploadResponse = {
    jobId: string
    phase: Phase
}