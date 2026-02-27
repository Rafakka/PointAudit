import { API_BASE } from "./client";

export async function clearInput(jobId:string){
    const res = await fetch(`${API_BASE}/jobs/${jobId}`,{
        method:"DELETE"
    })

    if (!res.ok){
        throw new Error("Delete failed")
    }
    return res.json();
}