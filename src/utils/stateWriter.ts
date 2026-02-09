import fs from 'fs'
import path from 'path'

export type PipelineState = {
    phase:string
    updatedAt:string
}

export function writeState(jobDir:string, state:{phase:string}) {
    const file = path.join(jobDir, "state.json")

    const payload: PipelineState = {
        phase:state.phase,
        updatedAt:new Date().toISOString(),
    }

    fs.writeFileSync(file, JSON.stringify(payload, null, 2))
}

export function readState(jobDir:string):PipelineState | null {
    const file = path.join(jobDir,"state.json")

    if (!fs.existsSync(file)) return null

    return JSON.parse(fs.readFileSync(file,"utf-8"))
}
