import fs from 'fs'
import express from "express";
import multer from "multer";
import { inputHandler } from "./core/fileManagement/inputHandler";
import { safeDelete } from "./utils/removerManager";

const app = express();
const upload = multer({dest:"tmp/"})

app.post(
    "/upload",
    upload.single("file"),
    inputHandler
);

app.listen(8000, ()=>{
    console.log("Backend running on http://localhost:8000")
})

app.delete
("/input",safeDelete)

app.get("/input/state",(req, res)=>{
    const exits = fs.existsSync("input") && fs.readdirSync("input").length > 0;

    res.json({hasInput:exits})
})
