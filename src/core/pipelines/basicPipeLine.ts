import fs from 'fs'
import path from 'path'
import { readState, writeState } from '../state/state'
import { runExtraction } from './extractionPipeLine'
import { WaitForConfirmation } from './userInputsFromUi'
import { loadPersonalJson } from '../fileManagement/personalJson'
import { loadTimeSheetJson } from '../fileManagement/timeSheetJson'
import { JoinedUserContext, WriteJsonOutput } from '../fileManagement/ouputTypes'


export async function RunBasicPipeLine(
    jobDir:string,
){

    if (!fs.existsSync(jobDir)) {
        throw new Error(`Pdf not found at${jobDir}`)
    }

    const state = readState(jobDir)

    if(!state) {
        throw new Error("Pipeline state missing")
    }

    switch (state.phase) {

        case "ingested":
            return await runExtraction(jobDir)
        
        case "extracted":
            return await WaitForConfirmation(jobDir)

        case "confirmed":
            return await runFinalization(jobDir)

        case "finalized":
            return {
                phase: "finalized",
                message:"Pipeline already completed"
            }

        default:
            throw new Error (`Unknown phase:${state.phase}`)
    }
}

export async function runFinalization(jobDir:string){

    const state = readState(jobDir)

    if (!state || state.phase !== "confirmed") {
        throw new Error (`Cannot finalize job in phase ${state?.phase??"unknown"}`)
    }

    const personal = await loadPersonalJson(jobDir)
    const timesheet = await loadTimeSheetJson(jobDir)

    const context: JoinedUserContext = {
        meta: personal.meta,
        person:personal.person,
        timesheet:timesheet.dias,
    }

    const outputDir = path.join(jobDir,"output")
    const outputPath = WriteJsonOutput(context, outputDir)

    writeState(jobDir,"finalized")

    return {
        phase:"finalized",
        outputPath,
        userId:context.meta.userId
    }

}