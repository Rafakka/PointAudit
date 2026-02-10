import * as fs from 'fs'
import * as path from 'path'
import { PersonalData } from './types'
import { MaskedPersonalData } from './types'


function maskId(id:string) {
    return id.slice(0,2) + "****" + id.slice(-2)
}

function maskName(name:string) {
    const [first,...rest] = name.split("")
    return `${first}${rest.map(()=>"*").join("")}`
}

export function savePersonalJson(
    data:PersonalData,
    outputDir:string
) {

    const person: MaskedPersonalData["person"] = {
        name:maskName(data.person.name),
        employeeIdHash:maskId(data.person.employeeId ?? ""),
    }

    if (data.person.role) {
        person.role = data.person.role
    }

    if (data.person.company) {
        person.company = data.person.company
    }

    const metaWithUserId = data.meta

    const masked:MaskedPersonalData = {
        meta:metaWithUserId,
        person
    }
    
    fs.mkdirSync(outputDir,{recursive:true})

    const fileName = `personal.json`

    const filePath = path.join(outputDir,fileName)
    const tmpPath = filePath + ".tmp"

    if (fs.existsSync(filePath)) {
        throw new Error(`Personal.json already exists ar ${filePath}`)
    }

    const json = JSON.stringify(masked, null, 2)

    fs.writeFileSync(tmpPath, json, "utf-8")
    fs.renameSync(tmpPath, filePath)

    return filePath

}

export async function loadPersonalJson(baseDir:string){

    if(!fs.existsSync(baseDir)){
        throw new Error(`personal.json not found at ${baseDir}`)
    }

    return JSON.parse(fs.readFileSync(baseDir,"utf-8"))
}
