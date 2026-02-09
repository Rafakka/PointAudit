
export async function uploadPdf(file:File){
    const fromData = new FormData()
    fromData.append("file", file)

    const res = await fetch("http://localhost:8000/upload",{
        method:"POST",
        body: fromData,
    })

    if (!res.ok){
        throw new Error("Upload failed")
    }

    return res.json() as Promise<{
        jobId:string
    }>
}