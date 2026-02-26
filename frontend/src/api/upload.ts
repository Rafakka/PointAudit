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
        throw new Error("Upload failed")
    }

    return res.json() 
    }