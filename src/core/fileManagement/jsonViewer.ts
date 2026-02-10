import { JsonArtifact } from "./types";
import fs from 'fs'
import path from 'path'

export function listJsonFiles(dir:string):JsonArtifact[] {
    if(!fs.existsSync(dir)) {
        return []
    }

    return fs
    .readdirSync(dir)
    .filter(file=> file.endsWith(".json"))
    .map(file => {
        const fullPath = path.join(dir,file)
        const stat = fs.statSync(fullPath)

        return {
            name:file,
            path:fullPath,
            size:stat.size,
            updatedAt:stat.mtimeMs

        }
    })

}

export function loadJsonFile <T = unknown>(filePath:string):
T {
    if (!fs.existsSync(filePath)){
        throw new Error(`JSON not found:${filePath}`)
    }

    const raw = fs.readFileSync(filePath, "utf-8")

    try {
        return JSON.parse(raw) as T }catch{ throw new Error(`Invalid JSON:${filePath}`)

        }
}

export function listJobJson(jobDir:string):JsonArtifact[]{
    const jsonDir = path.join(jobDir, "output","json")
    return listJsonFiles(jsonDir)
}

export function loadJobJson<T=unknown>(
    jobDir:string,
    fileName:string
): T {
    const filePath = path.join(jobDir,"output","json",fileName)
    return loadJsonFile<T>(filePath)
}