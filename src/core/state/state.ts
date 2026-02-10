import path from 'path'
import fs from 'fs'

export type PipeLinePhase =
| "ingested"
| "extracted"
| "confirmed"
| "finalized"
| "cancelled"

export interface PipeLineState {
    phase:PipeLinePhase,
    createdAt:string,
    updatedAt:string
}


export function InitState(jobDir:string) {
    const statePath = path.join(jobDir,".state.json")

    if (fs.existsSync(statePath)) return

    const now = new Date().toISOString()

    const state: PipeLineState = {
        phase:"ingested",
        createdAt:now,
        updatedAt:now
    }

    fs.writeFileSync(statePath, JSON.stringify(state, null, 2))
}

export function writeState(jobDir:string, nextPhase:PipeLinePhase) {
    const file = path.join(jobDir, "state.json")
    const prev = readState(jobDir)

    if (!prev){
        throw new Error ("State does not exist.Did you forget InitState?")
    }

    const updated: PipeLineState = {
        ...prev,
        phase:nextPhase,
        updatedAt:new Date().toISOString(),
    }

    fs.writeFileSync(file, JSON.stringify(updated, null, 2))
}

export function readState(jobDir:string):PipeLineState | null {
    const file = path.join(jobDir,"state.json")

    if (!fs.existsSync(file)) return null

    return JSON.parse(fs.readFileSync(file,"utf-8"))
}