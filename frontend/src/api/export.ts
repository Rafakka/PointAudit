
import {API_BASE} from "./client.ts"
import type {OutputType} from "../../../contracts/outputTypes.ts"

export async function exportJob(
    jobId:string,
    type: OutputType
){
    const res = await fetch(
        `${API_BASE}/jobs/${jobId}/export`,
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({type})
        }
    )

    if(!res.ok){
        const err = await res.json()
        throw new Error(err.error)
    }

    return res.json()
}
