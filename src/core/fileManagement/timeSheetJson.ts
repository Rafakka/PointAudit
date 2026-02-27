
import * as fs from 'fs'
import * as path from 'path'
import { PersonalTimeData } from './types'

function normalizePairs(
    pairs: {h:number, m:number}[] | undefined, required = 4
) {
    const safe = pairs ?? []
    const filled = [...safe]

    while (filled.length < required) {
        filled.push({h:0, m:0})
    }
    return filled.slice(0,required)
}

export function saveTimeSheetJson(
    data:PersonalTimeData,
    outputDir:string
){
    const normalizedDias = Object.fromEntries(
    Object.entries(data.dias ?? {}).map(([date,day]) => [
            date,
            {
                ...day,
                previsto:normalizePairs(day.previsto),
                realizado:normalizePairs(day.realizado)
            }
        ])
    )

    const payload: PersonalTimeData = {
        meta:data.meta,
        dias:normalizedDias
    }

    fs.mkdirSync(outputDir,{recursive:true})

    const fileName = `timesheet.json`
    const filePath = path.join(outputDir,fileName)
    const tmpPath = filePath + ".tmp"
    const json = JSON.stringify(payload, null, 2)

    fs.writeFileSync(tmpPath, json, "utf-8")
    fs.renameSync(tmpPath, filePath)

    return filePath
}


export async function loadTimeSheetJson(baseDir:string): Promise<{
    data: PersonalTimeData
    path:string
}>{

    const filePath = path.join(baseDir,"timesheet.json")

    if(!fs.existsSync(filePath)){
        throw new Error ("timesheet.json not found")
    }

    const raw = fs.readFileSync(filePath, "utf8")
    const data = JSON.parse(raw)

    return {
        data,
        path:filePath
    }

}