import { API_BASE } from "./client"
import type { uploadResponse } from "../types/pipeline"

export async function uploadPdf(file:File):Promise<uploadResponse>{
    const fromData = new FormData()
    fromData.append("file", file)

    const res = await fetch(`${API_BASE}/upload`,{
        method:"POST",
        body: fromData,
    })

    if (!res.ok){
        const err = await res.json()
        throw new Error(err.console.error ||
        "Upload failed")
    }
    
    return res.json() 
    }