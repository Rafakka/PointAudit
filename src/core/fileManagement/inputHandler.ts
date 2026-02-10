import { Request } from "express";
import { InitState } from "../state/state";
import fs from 'fs'
import path from 'path'

export async function inputHandler(req:Request): Promise <{jobDir:string; phase:"ingested"}> {
    
    if(!req.file) {
        throw new Error ("no file uploaded")
    }

    const jobDir = path.resolve("input",`job-${Date.now()}`)

    fs.mkdirSync(jobDir,{recursive:true})

    const destination = path.join(jobDir,"original.pdf")

    fs.copyFileSync(req.file.path, destination)

    InitState(jobDir)

    fs.unlinkSync(req.file.path)

    return {        
        jobDir,
        phase:"ingested"
    }
}
