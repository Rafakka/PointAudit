import * as fs from 'fs'
import * as path from 'path'

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

export function WriteJsonOutput(
    context:JoinedUserContext,
    outputDir:string,
) {
    fs.mkdirSync(outputDir,{recursive:true})

    const filePath = path.join(
        outputDir,
        `output.${context.meta.userId}.json`
    )

    fs.writeFileSync(
        filePath,
        JSON.stringify(context, null, 2),
        "utf-8"
    )
    return filePath
}