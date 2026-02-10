import * as fs from 'fs'
import * as path from 'path'
import { JoinedUserContext } from './types'

export function WriteJsonOutput(
    context:JoinedUserContext,
    outputDir:string,
) {
    fs.mkdirSync(outputDir,{recursive:true})

    const filePath = path.join(
        outputDir,
        `output.${context.meta.userId}.json`
    )

    fs.writeFileSync(
        filePath,
        JSON.stringify(context, null, 2),
        "utf-8"
    )
    return filePath
}

export { JoinedUserContext }
