
import * as fs from 'fs'
import * as path from 'path'
import { JobDocument } from '../../../contracts'

export function saveJobDocument(
  outputDir: string,
  data: JobDocument
) {
  const normalizedDias = Object.fromEntries(
    Object.entries(data.timesheet.dias ?? {}).map(([date, day]) => [
      date,
      {
        ...day,
        previsto: normalizePairs(day.previsto),
        realizado: normalizePairs(day.realizado),
      }
    ])
  )

  const payload: JobDocument = {
    ...data,
    timesheet: {
      dias: normalizedDias
    }
  }

  fs.mkdirSync(outputDir, { recursive: true })

  const filePath = path.join(outputDir, "job.json")
  const tmpPath = filePath + ".tmp"

  fs.writeFileSync(tmpPath, JSON.stringify(payload, null, 2), "utf-8")
  fs.renameSync(tmpPath, filePath)

  return filePath
}

export function loadJobDocument(outputDir:string): JobDocument{

    const filePath = path.join(outputDir,"job.json")

    if(!fs.existsSync(filePath)){
        throw new Error ("timesheet.json not found")
    }

    const raw = fs.readFileSync(filePath, "utf8")
    const parsed = JSON.parse(raw)

    return parsed as JobDocument

}

export function normalizePairs(
    pairs: {h:number, m:number}[] | undefined, required = 4
) {
    const safe = pairs ?? []
    const filled = [...safe]

    while (filled.length < required) {
        filled.push({h:0, m:0})
    }
    return filled.slice(0,required)
}