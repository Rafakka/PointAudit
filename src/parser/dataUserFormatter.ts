import { parse } from "path";
import { generatedUserId } from "../core/fileManagement/hasher";

export interface UserIdentity {
    userId:string
    meta : {
        schemaVersion:number
        extractedAt:string
        source:string
        userId:string
    }
    person : {
        name:string
        employeeId:string
        role?:string
        company?:string
        costCenter?:string
    }
}

interface DadosFuncionario {
    nome:string
    centroCusto:string
    atrasos:string
    cargo:string
    registro:string
}

interface FormatterInput{
    parsed:DadosFuncionario
    source:string
    extractedAt?:string
    company?:string
}

export function formatUserData({
    parsed,
    source,
    extractedAt = new Date().toISOString(),
    company
}:FormatterInput):UserIdentity {
    const rawUserKey = parsed.registro ? parsed.registro :
    `${parsed.nome}:${company ?? "unknown"}`

    const userId = generatedUserId(rawUserKey)

    const meta = {
        schemaVersion:1,
        extractedAt,
        source,
        userId
    }

    const person: UserIdentity["person"] = {
        name:parsed.nome,
        employeeId:parsed.registro,
    }

    if(parsed.cargo) {
        person.role = parsed.cargo
    }

    if (parsed.centroCusto) {
        person.company = parsed.centroCusto
    }

    if(company) {
        person.company = company
    }

    return {
        userId,
        meta,
        person,
    }
}



