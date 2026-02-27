
import * as fs from 'fs'

export function safeDelete(inputPath:string):boolean {

    if(!fs.existsSync(inputPath)) {
        return false
    }

    fs.rmSync(inputPath, {recursive:true, force:true})
    return true 
}
