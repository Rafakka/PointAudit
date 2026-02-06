import { generatedUserId } from "./hasher";

export function identifyUser(input:{
    employeedId?: string
    name: string
    company?:string
}): string {
    const rawKey = input.employeedId ?? `${input.name}:${input.company ?? "unknown"}`
    
    return generatedUserId(rawKey)
}