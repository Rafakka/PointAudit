import path from 'path'
import fs from 'fs'
import { normalize } from "../../parser/basic"
import { extractData } from "../../parser/dataUserParser"
import { buildTimeSheet } from "../../parser/timeSheetFormatter"
import { formatUserData } from "../../parser/dataUserFormatter"
import { extrairDadosPonto } from '../../parser/commonPdfParser'
import { saveJobDocument } from '../fileManagement/jobDocumentTools'
import { JobDocument, PersonData } from '../../../contracts'

export async function runExtraction(
    jobDir:string, 
):Promise<JobDocument> {

    const files = fs.readdirSync(jobDir)
    const pdfFile = files.find(f=>f.toLocaleLowerCase().endsWith(".pdf"))
    
    if (!pdfFile){
        throw new Error("No pdf found inside test/input")
    }

    const pdfPath = path.join(jobDir, pdfFile)

    const result = await extrairDadosPonto(pdfPath)
    const normalized = normalize(result)

    const personalRaw = extractData(normalized)

    const person: PersonData = {
        name:personalRaw.nome,
        employeeId:personalRaw.registro,
        role:personalRaw.cargo,
        department:personalRaw.centroCusto,
        company:personalRaw.centroCusto
    }

    const timesheetRaw = buildTimeSheet(normalized)

    const jobId = path.basename(jobDir)

    const jobDocument: JobDocument = {
        meta : {
            jobId,
            extractedAt: new Date().toISOString(),
            source:pdfFile,
            schemaVersion:1
        },
        phase:"extracted",
        person,
        timesheet:timesheetRaw
    } 
    
    saveJobDocument(jobDir, jobDocument)

    return jobDocument
}