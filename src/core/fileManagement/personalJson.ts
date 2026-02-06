import * as fs from 'fs'
import * as path from 'path'
import { generatedUserId } from './hasher'

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

type MaskedPersonalData = {
    meta:PersonalData["meta"]
    person: {
        name:string
        employeeIdHash:string
        role?:string
        company?:string
    }
}

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

    const rawUserKey = data.person.employeeId ??
    `${data.person.name}:${data.person.company ?? "unknown"}`

    const userId = generatedUserId(rawUserKey)

    const metaWithUserId: PersonalData["meta"] = {
        ...data.meta,
        userId
    }

    const masked:MaskedPersonalData = {
        meta:metaWithUserId,
        person
    }
    
    fs.mkdirSync(outputDir,{recursive:true})

    const fileName = `data.${metaWithUserId.userId}.json`

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