import { Request, Response } from "express";
import fs from 'fs'
import path from 'path'
import { randomUUID } from "crypto";

export async function inputHandler(req:Request, res:Response) {
    if(!req.file) {
        return res.status(400).json({error:"no file uploaded"});
    }
    
    const jobId = randomUUID();

    const jobDir = path.resolve("input",jobId)
    fs.mkdirSync(jobDir,{recursive:true})

    const destination = path.join(jobDir,"original.pdf")

    fs.copyFileSync(req.file.path, destination)

    fs.unlinkSync(req.file.path)

    return res.json({
        jobId,
        status:"queued"
    });
}