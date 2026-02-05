
import * as fs from 'fs'
import * as path from 'path'

export interface PersonalData {
    meta : {
        schemaVersion:number
        extractedAt:string
        source:string
    }
    person: {
        name:string
        employeeId?:string
        role?: string
        department?:string
        company?:string
    }
}

export function savePersonalJson(
    data:PersonalData,
    outputDir:string
) {
    fs.mkdirSync(outputDir,{recursive:true})

    const filePath = path.join(outputDir,"personal.json")
    const tmpPath = filePath + ".tmp"

    const json = JSON.stringify(data, null, 2)

    fs.writeFileSync(tmpPath, json, "utf-8")
    fs.renameSync(tmpPath, filePath)

    return filePath

}