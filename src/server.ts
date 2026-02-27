import cors from "cors"
import fs from 'fs'
import express from "express";
import multer from "multer";
import path from 'path'
import { inputHandler } from "./core/fileManagement/inputHandler";
import { RunBasicPipeLine, runFinalization } from './core/pipelines/basicPipeLine';
import { writeState, readState } from './core/state/state';
import { loadPersonalJson, savePersonalJson } from './core/fileManagement/personalJson';
import { loadTimeSheetJson, saveTimeSheetJson } from './core/fileManagement/timeSheetJson';
import { getJobBalance } from "./core/services/balanceServices";

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
            const result = await inputHandler(req)

            return res.json({
                jobId:result.jobId,
                phase:result.phase,
            })
        } catch (err:any) {
            return res.status(400).json({
                error:err.message
            })
        }
    }
);

app.get ("/jobs/:jobId/state",(req, res)=>{
    try {
        
        const {jobId} = req.params

        if(!jobId.startsWith("job-")){
            return res.status(400).json({error:"invalid job id"})
        }

        const state = readState(INPUT_ROOT)

        if(!state) {
            return res.status(404).json({error:"job not found"})
        }

        return res.json(state)
    } catch (err:any) {
        return res.status(400).json({error:err.message})
        }
    })

app.get("/jobs/:jobId/extracted", async (req, res)=>{
    try {

        const raw = req.params.jobId

        if (typeof raw!=="string" || !raw.startsWith("job-")){
            return res.status(400).json({error:"invalid job id"})
        }

        const jobId = raw
        
        const jobDir =path.join(INPUT_ROOT,jobId)

        await RunBasicPipeLine(jobDir)
        
        writeState(jobDir,"extracted")

        const state = readState(jobDir)

        if(!state) {
            throw new Error("job not found")
        }

        const personal = await loadPersonalJson(jobDir)
        const timesheet = await loadTimeSheetJson(jobDir)

        const updatedState = readState(jobDir)

        if(!updatedState){
            throw new Error("Failed to update state")
        }

        return res.json({
            phase:updatedState.phase,
            data:{
            personal, 
            timesheet}
        })
    } catch(err:any) {
        return res.status(400).json({error:err.message})
    }
})


app.post("/jobs/:jobId/confirm", async (req, res) => {
    try{

        const {jobId} = req.params

        if(!jobId.startsWith("job-")){
            return res.status(400).json({error:"invalid job id"})
        }

        const jobDir = path.join(INPUT_ROOT, jobId)

        const state = readState(jobDir)

        if(!state || state.phase !== "extracted") {
            throw new Error("Job is not ready for confirmation")
        }
        writeState(jobDir,"confirmed")

        return res.json({
            phase:"confirmed"
        })
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

        const state = readState(jobDir)

        if (!state || state.phase !== "confirmed") {
            throw new Error("Job must be confirmed before finalizing")
        }
        
        await runFinalization(jobDir)

        writeState(jobDir, "finalized")

        return res.json ({
            phase:"finalized"
        })

    }catch(err:any) {
        return res.status(400).json({
            error:err.message,
        })
    }
})

app.put("/jobs/:jobId/audit", async (req, res) => {
  try {
    const {jobId} = req.params

    if(!jobId.startsWith("job-")){
        return res.status(400).json({error:"invalid job id"})
    }

    const jobDir = path.join(INPUT_ROOT, jobId)

    const { personal, timesheet } = req.body

    savePersonalJson(personal, jobDir)
    saveTimeSheetJson(timesheet, jobDir)

    return res.json({ phase: "extracted" })
  } catch (err:any) {
    return res.status(400).json({ error: err.message })
  }
})

app.delete("/jobs/:jobId", async (req, res) => {
    try {
    const {jobId} = req.params

    if (!jobId || jobId.startsWith("job-")) {
        return res.status(400).json({error:"invalid job id"})
    }

    const jobDir = path.join(INPUT_ROOT, jobId)

    if(fs.existsSync(jobDir)) {
        return res.status(404).json({error:"job not found"})
    }
    
    fs.rmSync(jobDir, {recursive:true, force:true})

    return res.json({deleted:true}) 
} catch (err:any) {
    return res.status(500).json({error:err.message})
    } 
})

app.get("/input/state",(req, res)=>{
    const exits = fs.existsSync("input") && fs.readdirSync("input").length > 0;

    res.json({hasInput:exits})
})

app.get("/jobs/:jobId/balance", async (req, res) => {
  try {
    const {jobId} = req.params
    if(!jobId.startsWith("job-")){
            return res.status(400).json({error:"invalid job id"})
    }
    const jobDir = path.join(INPUT_ROOT, jobId)
    const result = await getJobBalance(jobDir)

    res.json(result)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to calculate balance" })
  }
})