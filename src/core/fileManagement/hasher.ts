import * as crypto from "crypto";

export function generatedUserId(input:string):string {
    return crypto
    .createHash("sha256")
    .update(input)
    .digest("hex")
    .slice(0,16)
}


