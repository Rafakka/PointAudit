import path from "path"
import { safeDelete } from "../../utils/removerManager"


export function deleteJob(jobId:string, root:string): boolean {
    if(!jobId.startsWith("job-")) {
        throw new Error("invalid job id")
    }
    
    const jobDir = path.join(root, jobId)
    return safeDelete(jobDir)

}
