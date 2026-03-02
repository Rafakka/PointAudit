import type {ConfirmResponse, ExtractedResponse} from "@contracts"
import { API_BASE } from "./client";


export async function getJobState(jobId:string) {
    const res = await fetch(`${API_BASE}/jobs/${jobId}/state`)
    
    if(!res.ok) throw new Error("Failed to load state")
        return res.json()
}

export async function getExtractedData(jobId:string): Promise<ExtractedResponse>{
    const res = await fetch(`${API_BASE}/jobs/${jobId}/extracted`)    
    if(!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to load extracted data")
    }
        return res.json()
}

export async function confirmJob(jobId:string): Promise<ConfirmResponse> {
    const res = await fetch(`${API_BASE}/jobs/${jobId}/confirm`,{
        method:"POST",
    })

    if(!res.ok) throw new Error("Failed to confirm job")
        return res.json()
}

export async function finalizeJob(jobId:string) {
    const res = await fetch(`${API_BASE}/jobs/${jobId}/finalize`,{
        method:"POST",
    })

    if(!res.ok) throw new Error("Failed to finalize job")
        return res.json()
}
 