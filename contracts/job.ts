import type {Phase} from "./phase"
import type {BalancedResult} from "./balance"

export type ConfirmResponse = {
    phase: Phase,
    balance: BalancedResult
}

export type uploadResponse = {
    jobId: string
    phase: Phase
}

export interface ExtractedResponse {
    phase: Phase
    data: {
        personal: {
            data:{
                meta:JoinedUserContext["personal"]["meta"]
                person:JoinedUserContext["person"]
            }
            path:string
        }
        timesheet:{
            data:{
            meta:JoinedUserContext["timesheet"]["meta"]
            dias:JoinedUserContext["timesheet"]["dias"]
            }
            path:string
        }
    }
}

export interface JoinedUserContext {
    personal :{
    meta:{
        userId:string
        source:string
        extractedAt:string
        schemaVersions: {
            personal:number
            timesheet: number
            }
        }
    }
    person:{
        name:string
        employeeIdHash:string
        role?:string
        company?:string
    } 
    timesheet : {
        meta: {
            schemaVersion:number
            extractedAt:String
        }
        dias:Record<
        string,
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