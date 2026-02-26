import path from 'path'
import fs from 'fs'
import { normalize } from "../../parser/basic"
import { extractData } from "../../parser/dataUserParser"
import { buildTimeSheet } from "../../parser/timeSheetFormatter"
import { formatUserData } from "../../parser/dataUserFormatter"
import { savePersonalJson } from "../fileManagement/personalJson"
import { saveTimeSheetJson } from "../fileManagement/timeSheetJson"
import { writeState } from "../state/state"
import { extrairDadosPonto } from '../../parser/commonPdfParser'

export async function runExtraction(
    jobDir:string, 
) {

    const files = fs.readdirSync(jobDir)
    const pdfFile = files.find(f=>f.toLocaleLowerCase().endsWith(".pdf"))
    
    if (!pdfFile){
        throw new Error("No pdf found inside test/input")
    }

    const pdfPath = path.join(jobDir, pdfFile)

    const result = await extrairDadosPonto(pdfPath)
    const normalized = normalize(result)

    const personal = extractData(normalized)
    const timesheet = buildTimeSheet(normalized)

    const personalData = formatUserData ({
        parsed:personal,
        source:path.basename(jobDir)
        })
            
    savePersonalJson(personalData, jobDir)

    const timeData = {
        meta:personalData.meta,
        dias:timesheet.dias
        }

    saveTimeSheetJson(timeData,jobDir)

    writeState(jobDir,"extracted")

    return {
        phase:"extracted",
        personalData,
        timeData
    }
}