import fs from 'fs'
import path from 'path'
import { readState, writeState } from '../state/state'
import { runExtraction } from './extractionPipeLine'
import { WaitForConfirmation } from './userInputsFromUi'
import { loadPersonalJson } from '../fileManagement/personalJson'
import { OutputManager } from '../fileManagement/outputManager'


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

    const {data:personal} = await loadPersonalJson(jobDir)

    const outputPath = await OutputManager({
        baseDir:jobDir,
        userId:personal.meta.userId,
        outputType:"json",
        outputDir: path.join(jobDir,"output")
    })

    writeState(jobDir,"finalized")

    return {
        phase:"finalized",
        outputPath,
        userId:personal.meta.userId
    }

}