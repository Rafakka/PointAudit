

import type {OutputType} from "../../../contracts/outputTypes.ts"
import type { JobDocument } from '../../../contracts/job.ts'
import { writeJsonOutput} from "../../core/exporters/jsonExporter.ts"

interface OutputManagerOptions {
    job: JobDocument
    outputType: OutputType
    outputDir:string
}

export async function outputManager(
    options: OutputManagerOptions
): Promise<string> {

    const { job, outputType, outputDir } = options

    switch (outputType) {

        case "json":
            return writeJsonOutput(job, outputDir)

        case "pdf":
            return writePdfOutput(job, outputDir)

        case "xlsx":
            return writeXlsxOutput(job, outputDir)

        default:i
            throw new Error("unsupported output")
    }
}

