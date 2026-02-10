import { API_BASE } from "./client";

export async function getJobState(jobDir:string) {
    const res = await fetch(`${API_BASE}/jobs/${jobDir}/state`)
    
    if(!res.ok) throw new Error("Failed to load state")
        return res.json()
}

export async function getExtractedData(jobDir:string) {
    const res = await fetch(`${API_BASE}/jobs/${jobDir}/extracted`)    
    
    if(!res.ok) throw new Error("Failed to load extracted data")
        return res.json()
}

export async function confirmJob(jobDir:string) {
    const res = await fetch(`${API_BASE}/jobs/${jobDir}/confirm`,{
        method:"POST",
    })

    if(!res.ok) throw new Error("Failed to confirm job")
        return res.json()
}

export async function finalizeJob(jobDir:string) {
    const res = await fetch(`${API_BASE}/jobs/${jobDir}/finalize`,{
        method:"POST",
    })

    if(!res.ok) throw new Error("Failed to finalize job")
        return res.json()
}
