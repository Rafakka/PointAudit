import cors from "cors"
import fs from 'fs'
import express from "express";
import multer from "multer";
import { inputHandler } from "./core/fileManagement/inputHandler";
import { safeDelete } from "./utils/removerManager";
import { RunBasicPipeLine, runFinalization } from './core/pipelines/basicPipeLine';
import { writeState, readState } from './core/state/state';
import { loadPersonalJson, savePersonalJson } from './core/fileManagement/personalJson';
import { loadTimeSheetJson, saveTimeSheetJson } from './core/fileManagement/timeSheetJson';
import { getJobBalance } from "./core/services/balanceServices";


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
            return res.json(result)
        } catch (err:any) {
            return res.status(400).json({
                error:err.message
            })
        }
    }
);

app.get ("/jobs/:jobDir/state",(req, res)=>{
    try {
        const {jobDir} = req.params
        const state = readState(jobDir)

        if(!state) {
            return res.status(404).json({error:"job not found"})
        }

        return res.json(state)
    } catch (err:any) {
        return res.status(400).json({error:err.message})
        }
    })

app.get("jobs/:jobDir/extracted", async (req, res)=>{
    try {
        const {jobDir} = req.params
        const state = readState(jobDir)

        if(!state || state.phase !== "extracted") {
            throw new Error("job not in extracted phase")
        }

        const personal = await loadPersonalJson(jobDir)
        const timesheet = await loadTimeSheetJson(jobDir)

        return res.json({personal, timesheet})
    } catch(err:any) {
        return res.status(400).json({error:err.message})
    }
})


app.post("/jobs/:jobDir/confirm", async (req, res) => {
    try{
        const { jobDir } = req.params

        const state = readState(jobDir)

        if(!state || state.phase !== "extracted") {
            throw new Error("Job is not ready for confirmation")
        }
        writeState(jobDir,"confirmed")

        return res.json({
            phase:"confirmed",
            jobDir,
        })
    } catch (err:any) {
        return res.status(400).json({error:err.message})
    }
})

app.post("/jobs/:jobDir/finalize",async (req, res)=>{
    try {
        const { jobDir } = req.params
        const result = await runFinalization(jobDir)
        return res.json(result)

    }catch(err:any) {
        return res.status(400).json({
            error:err.message,
        })
    }
})

app.put("/jobs/:jobDir/audit", async (req, res) => {
  try {
    const { jobDir } = req.params
    const { personal, timesheet } = req.body

    savePersonalJson(personal, jobDir)
    saveTimeSheetJson(timesheet, jobDir)

    return res.json({ phase: "extracted" })
  } catch (err:any) {
    return res.status(400).json({ error: err.message })
  }
})

app.delete
("/input",safeDelete)

app.get("/input/state",(req, res)=>{
    const exits = fs.existsSync("input") && fs.readdirSync("input").length > 0;

    res.json({hasInput:exits})
})

app.post("/pipeline/cancel", async(req, res)=>{
    const {jobDir}= req.body
    writeState(jobDir,'cancelled')
    res.json({phase:"cancelled"})
})

app.get("/jobs/:jobId/balance", async (req, res) => {
  try {
    const { jobId } = req.params

    const result = await getJobBalance(jobId)

    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to calculate balance" })
  }
})