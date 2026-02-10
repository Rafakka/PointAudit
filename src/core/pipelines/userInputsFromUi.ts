import path from 'path'
import fs from 'fs'

export async function WaitForConfirmation(jobDir:string) {
    const personalPath = path.join(jobDir,"personal.json")
    const timesheetPath = path.join(jobDir,"timesheet.json")

    if (!fs.existsSync(personalPath) || ! fs.existsSync(timesheetPath)) {
        throw new Error("Extract incomplete --- missing Json artifacts")
    }

    const personalData = JSON.parse(fs.readFileSync(personalPath, "utf-8"))

    const timeData = JSON.parse(fs.readFileSync (timesheetPath, "utf-8"))

    return {
        phase:"extracted" as const,
        personalData,
        timeData,
        actions:["confirm","cancel"]
    }
}
