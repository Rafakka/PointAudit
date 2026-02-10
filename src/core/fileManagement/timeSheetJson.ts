
import * as fs from 'fs'
import * as path from 'path'
import { PersonalTimeData } from './types'


export function saveTimeSheetJson(
    data:PersonalTimeData,
    outputDir:string
){

    const payload:PersonalTimeData = {
        meta:data.meta,
        dias:data.dias
    }

    fs.mkdirSync(outputDir,{recursive:true})

    const fileName = `timesheet.json`
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

export async function loadTimeSheetJson(baseDir:string){

    const file = path.join(baseDir,"timesheet.json")

    if(!fs.existsSync(file)){
        throw new Error ("timesheet.json not found")
    }

    return JSON.parse(fs.readFileSync(file,"utf-8"))

}