
import * as fs from 'fs'
import * as path from 'path'
import { meta } from 'zod'

interface TimeHm {
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


export function saveTimeSheetJson(
    data:PersonalTimeData,
    outputDir:string
){

    const payload:PersonalTimeData = {
        meta:data.meta,
        dias:data.dias
    }

    fs.mkdirSync(outputDir,{recursive:true})

    const {userId} = data.meta

    const fileName = `timeSheet.${userId}.json`
    const filePath = path.join(outputDir,fileName)
    const tmpPath = filePath + ".tmp"

    if (fs.existsSync(filePath)) {
        throw new Error(`Personal.json already exists at ${filePath}`)
    }

    const json = JSON.stringify(payload, null, 2)

    fs.writeFileSync(tmpPath, json, "utf-8")
    fs.renameSync(tmpPath, filePath)

    return filePath

}