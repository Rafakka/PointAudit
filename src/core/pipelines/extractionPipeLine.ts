import path from 'path'
import { loadPdfText } from "../../../tests/helpers/loadPdfText"
import { normalize } from "../../parser/basic"
import { extractData } from "../../parser/dataUserParser"
import { buildTimeSheet } from "../../parser/timeSheetFormatter"
import { formatUserData } from "../../parser/dataUserFormatter"
import { savePersonalJson } from "../fileManagement/personalJson"
import { saveTimeSheetJson } from "../fileManagement/timeSheetJson"
import { writeState } from "../state/state"

export async function runExtraction(
    jobDir:string, 
) {

    const rawText = await loadPdfText(jobDir)
    const normalized = normalize(rawText)

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