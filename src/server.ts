import fs from 'fs'
import path from 'path';
import express from "express";
import multer from "multer";
import { inputHandler } from "./core/fileManagement/inputHandler";
import { safeDelete } from "./utils/removerManager";
import { RunBasicPipeLine, runFinalization } from './core/pipelines/basicPipeLine';
import { writeState, readState } from './core/state/state';

const app = express();
const upload = multer({dest:"tmp/"})

app.use(express.json())

app.listen(8000, ()=>{
    console.log("Backend running on http://localhost:8000")
})

app.post(
    "/upload",
    upload.single("file"),
    async (req, res) => {
        try{
            const {jobDir} = await inputHandler(req)

            const result = await RunBasicPipeLine(jobDir)

            return res.json(result)
        } catch (err:any) {
            return res.status(400).json({
                error:err.message
            })
        }
    }
);

app.post("/jobs/:jobId/confirm", async (req, res) => {
    try{
        const jobDir = path.join("input", req.params.jobId)

        const state = readState(jobDir)
        if(!state || state.phase !== "extracted") {
            throw new Error("Job is not ready for confirmation")
        }
        writeState(jobDir,"confirmed")

        return res.json({
            phase:"confirmed",
        })
    } catch (err:any) {
        return res.status(400).json({error:err.message})
    }
})

app.post("/jobs/:jobId/finalize",async (req, res)=>{
    try {
        const jobDir = path.join("input", req.params.jobId)

        const result = await runFinalization(jobDir)

        return res.json(result)
    }catch(err:any) {
        return res.status(400).json({
            error:err.message,
        })
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