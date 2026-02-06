import * as fs from 'fs'
import * as path from 'path'
import { JoinedUserContext, OutputType } from './ouputTypes'
import { WriteJsonOutput } from './ouputTypes'

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
        `personal.${userId}.json`
    )

    const timeSheetPath = path.join(
        baseDir,
        `timesheet.${userId}.json`
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
                timesheet:personal.meta.timesheet
            }
        },
        person:personal.person,
        timesheet:{
            days:timesheet.dias
        }
    }

    switch(outputType) {
        case "json":
            return WriteJsonOutput(context, outputDir)
        case "csv":
            throw new Error("Not yet")
        case "pdf":
            throw new Error("Not yet")
        default:
            throw new Error("Not yet")
        }
    }
}