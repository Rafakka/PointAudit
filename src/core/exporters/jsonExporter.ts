
import path from "path"
import fs from 'fs'
import type {JobDocument} from "../../../contracts/job.ts"

export function writeJsonOutput(
    job: JobDocument,
    outputDir: string
): string {

    const filePath = path.join(
        outputDir,
        "job.json"
    )

    fs.writeFileSync(
        filePath,
        JSON.stringify(job, null, 2)
    )

    return filePath
}
