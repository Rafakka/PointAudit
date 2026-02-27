
import * as fs from 'fs'
import path from 'path'

export function safeDelete(req:Request, res:Response){
    const inputPath = path.join(process.cwd(),"input")

    if(fs.existsSync(inputPath)) {
        fs.rmSync(inputPath,{recursive:true, force:true})
    }
    
    res.json()
}
