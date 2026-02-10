import { API_BASE } from "./client"

export async function uploadPdf(file:File){
    const fromData = new FormData()
    fromData.append("file", file)

    const res = await fetch(`${API_BASE}/upload`,{
        method:"POST",
        body: fromData,
    })

    if (!res.ok){
        throw new Error("Upload failed")
    }

    return res.json() as Promise<{
        jobDir:string
        phase:"ingested"
        status:"queued"
    }>
}