import cors from "cors"
import fs from 'fs'
import express from "express";
import multer from "multer";
import path from 'path'
import {runExtraction} from "./core/pipelines/extractionPipeLine"
import { loadJobDocument, saveJobDocument} from './core/fileManagement/jobDocumentTools';
import { deleteJob } from "./core/services/deleteService";
import type {JobDocument} from "../contracts"
import { calculateTimeBank } from "./core/rules/timeBankRules";

const INPUT_ROOT = path.resolve("input")

const app = express();

app.use(cors())
app.use(express.json())

const upload = multer({dest:"tmp/"})

app.listen(8000, ()=>{
    console.log("Backend running on http://localhost:8000")
})

app.post(
    "/upload",
    upload.single("file"),
    async (req, res) => {
        try{

            if (!req.file){
                return res.status(400).json({error:"no file uploaded"})
            }

            const jobId = `job-${Date.now()}`
            const jobDir = path.join(INPUT_ROOT,jobId)

            fs.mkdirSync(jobDir, {recursive:true})

            const originalName = req.file.originalname
            const targetPath = path.join(jobDir, originalName)

            fs.renameSync(req.file.path, targetPath)

            return res.json({
                jobId
            })
        } catch (err:any) {
            return res.status(500).json({
                error:err.message
            })
        }
    }
);


app.get("/jobs/:jobId/extract", async (req, res)=>{
 const {jobId} = req.params
 const jobDir = path.join(INPUT_ROOT,jobId)

 const job = await runExtraction(jobDir)

 res.json(job)
})


app.post("/jobs/:jobId/confirm", async (req, res) => {
    try{

        const {jobId} = req.params

        if(!jobId.startsWith("job-")){
            return res.status(400).json({error:"invalid job id"})
        }

        const jobDir = path.join(INPUT_ROOT, jobId)

        const job = loadJobDocument(jobDir)

        if(job.phase !== "extracted") {
            return res.status(400).json({error: "Job is not ready for confirmation"})
        }
       
        job.phase = "confirmed"

        saveJobDocument(jobDir, job)

        return res.json(job)
       
    } catch (err:any) {
        return res.status(400).json({error:err.message})
    }
})

app.post("/jobs/:jobId/finalize",async (req, res)=>{
    try {
        const {jobId} = req.params
        if(!jobId.startsWith("job-")){
            return res.status(400).json({error:"invalid job id"})
        }

        const jobDir = path.join(INPUT_ROOT, jobId)

        const job = loadJobDocument(jobDir)

        if (job.phase !== "confirmed"){
            return res.status(400).json({error:"invalid phase transition"})
        }

        job.phase = "finalized"
        
        saveJobDocument(jobDir, job)

        return res.json (job)

    }catch(err:any) {
        return res.status(400).json({
            error:err.message,
        })
    }
})


app.delete("/jobs/:jobId", async (req, res) => {
    try {
    const deleted = deleteJob(req.params.jobId, INPUT_ROOT)

    if(!deleted) {
        return res.status(404).json({error:"File not deleted"})
    }

    return res.json({deleted:true})

} catch (err:any) {
    return res.status(500).json({error:err.message})
    } 
})

app.get("/jobs/:jobId/balance", async (req, res) => {
  try {
    const {jobId} = req.params
    if(!jobId.startsWith("job-")){
            return res.status(400).json({error:"invalid job id"})
    }
    const jobDir = path.join(INPUT_ROOT, jobId)

    const job = loadJobDocument(jobDir)

    const balance = calculateTimeBank(job.timesheet)

    return res.json(balance)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to calculate balance" })
  }
})

app.post("/jobs/:jobId/update", async(req, res) => {
    const {jobId} = req.params
    const updatedData: JobDocument = req.body

    if (updatedData.meta.jobId !== jobId) {
        return res.status(400).json({error:"job id mismatch"})
    }

    const jobDir = path.join(INPUT_ROOT, jobId)

    await saveJobDocument(jobDir, updatedData)

    return res.json({ok:true})
})