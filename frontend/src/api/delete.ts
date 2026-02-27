
export async function clearInput(jobId:string){
    const res = await fetch(`/jobs/${jobId}`,{
        method:"DELETE"
    })

    if (!res.ok){
        throw new Error("Delete failed")
    }
    return res.json();
}