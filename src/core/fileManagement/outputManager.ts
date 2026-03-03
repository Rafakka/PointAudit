import { JoinedUserContext} from './ouputTypes'
import { WriteJsonOutput } from './ouputTypes'
import { safeDelete } from '../../utils/removerManager'
import { MaskedPersonalData, OutputType, PersonalTimeData } from './types'
import { loadPersonalJson } from './personalJson'
import { loadTimeSheetJson } from './jobDocumentTools'

interface OutputManagerOptions {
    baseDir: string
    userId: string
    outputType: OutputType
    outputDir:string
}

export async function OutputManager(options:OutputManagerOptions) { const { baseDir, outputType, outputDir } = options 
{
    const personalResult = await loadPersonalJson(baseDir)
    const timesheetResult = await loadTimeSheetJson(baseDir)

    const personal = personalResult.data
    const timesheet = timesheetResult.data

    const context = buildJoinedContext(personal, timesheet)

    const outputPath = writeOutput(context, outputType, outputDir)

    safeDelete(personalResult.path)
    safeDelete(timesheetResult.path)

    return outputPath

    }
}

function buildJoinedContext(
    personal:MaskedPersonalData,
    timesheet:PersonalTimeData
): JoinedUserContext {
    if(personal.meta.userId !== timesheet.meta.userId) {
        throw new Error("UserId mismatch")
    }

    return {
        meta: {
            userId:personal.meta.userId,
            source:personal.meta.source,
            extractedAt:personal.meta.extractedAt,
            schemaVersions: {
                personal: personal.meta.schemaVersion,
                timesheet:timesheet.meta.schemaVersion
            }
        },
        person:{
            name:personal.person.name,
            emplyeeIdHash:personal.person.employeeIdHash,
            role:personal.person.role,
            company:personal.person.company
        },
        timesheet: {
            days:timesheet.dias
        }
    }
}

function writeOutput (
    context:JoinedUserContext,
    outputType:OutputType,
    outputDir:string
): string {
    switch(outputType){
        case "json":
            return WriteJsonOutput(context, outputDir)
        case "csv":
            throw new Error("Not yet")
        case "pdf":
            throw new Error("Not yet")
        default:
            throw new Error("unsuported file")
    }
} 