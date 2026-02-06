
import * as fs from 'fs'

export function safeDelete(filePath:string){
    try {
        if(fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }
    } catch(err){
        console.warn(`Failed to delete ${filePath}`, err)
    }
}
