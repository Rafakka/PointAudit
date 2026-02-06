import * as fs from 'fs'
import * as path from 'path'
import { JoinedUserContext, OutputType } from './ouputTypes'
import { WriteJsonOutput } from './ouputTypes'
import { safeDelete } from '../../utils/removerManager'

interface OutputManagerOptions {
    baseDir: string
    userId: string
    outputType: OutputType
    outputDir:string
}

export function OutputManager(options:OutputManagerOptions) { const { baseDir, userId, outputType, outputDir } = options 
{
    const personalPath = path.join(
        baseDir,
        `data.${userId}.json`
    )

    const timeSheetPath = path.join(
        baseDir,
        `timeSheet.${userId}.json`
    )


    if (!fs.existsSync(personalPath)) {
        throw new Error(`Personal JSON not found: ${personalPath}`)
    }

    if (!fs.existsSync(timeSheetPath)) {
        throw new Error(`TimeSheet JSON not found: ${timeSheetPath}`)
    }

    const personal = JSON.parse(
        fs.readFileSync(personalPath,"utf-8")
    )

    const timesheet = JSON.parse(
        fs.readFileSync(timeSheetPath,"utf-8")
    )

    if (personal.meta.userId !== timesheet.meta.userId) {
        throw new Error("UserId mismatch between personal and timesheet")
    }

    const context: JoinedUserContext = {
        meta:{
            userId,
            source:personal.meta.source,
            extractedAt:personal.meta.extractedAt,
            schemaVersions:{
                personal:personal.meta.schemaVersions,
                timesheet:timesheet.meta.schemaVersions
            }
        },
        person:personal.person,
        timesheet:{
            days:timesheet.dias
        }
    }

    let outputPath:string

    switch(outputType) {
        case "json":
            outputPath = WriteJsonOutput(context, outputDir)
            break
        case "csv":
            throw new Error("Not yet")
        case "pdf":
            throw new Error("Not yet")
        default:
            throw new Error(`Unsupported output type:${outputType}`)
        }

        safeDelete(personalPath)
        safeDelete(timeSheetPath)

        return outputPath
    }
}