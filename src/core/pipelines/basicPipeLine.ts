import fs from 'fs'
import path from 'path'
import { loadPdfText } from '../../../tests/helpers/loadPdfText'
import { normalize } from '../../parser/basic'
import { extractData } from '../../parser/dataUserParser'
import { buildTimeSheet } from '../../parser/timeSheetFormatter'
import { formatUserData } from '../../parser/dataUserFormatter'
import { savePersonalJson, loadPersonalJson, PersonalData } from '../fileManagement/personalJson'
import { saveTimeSheetJson, loadTimeSheetJson } from '../fileManagement/timeSheetJson'
import { OutputManager } from '../fileManagement/outputManager'
import { writeState } from '../../utils/stateWriter'

export type PipelinePayload = {
    personal?: PersonalData
    dias?: TimeSheetData
}


export async function RunBasicPipeLine(jobDir:string, phase:"extracted"|"ingested"|"confirmed",payload?:PipelinePayload){

    fs.rmSync("output/json",{recursive:true, force:true})

    const outputBase = "output/json"
    const finalOutput = "output/json"

    if (!fs.existsSync(jobDir)) {
        throw new Error(`Pdf not found at${jobDir}`)
    }

    if (phase === "ingested") {
        const rawText = await loadPdfText(jobDir)
        const normalized = normalize(rawText)

        const personal = extractData(normalized)
        const timesheet = buildTimeSheet(normalized)

        const personalData = formatUserData ({
        parsed:personal,
        source:path.basename(jobDir)
        })
        
        savePersonalJson(personalData, outputBase)

        const timeData = {
        meta:personalData.meta,
        dias:timesheet.dias
        }

        saveTimeSheetJson(timeData,outputBase)

        return {
        phase:"extracted",
        personal:personalData,
        dias:timeData
        }
    }

    if (phase === "confirmed") {

        const personalData = payload?.personal?? loadPersonalJson(jobDir)
        const timeData = payload?.timesheet?? loadTimeSheetJson(jobDir)

        const result = OutputManager({
            baseDir:jobDir,
            userId:personalData.meta.userId,
            outputType:"json",
            outputDir:finalOutput
        })

        writeState(jobDir,{
            phase:"finalized"
        })

        return {
            phase:"finalized",
            result,
            }
        }
    }