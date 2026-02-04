import * as fs from 'fs'
import { Line, PDFParse } from 'pdf-parse'

interface DadosFuncionario {
    nome:string
    centroCusto:string
    atrasos:string
    cargo:string
    identificador:string
}

type TimeHm = {
    h:number
    m:number
}

type DayRecord = {
    date:string
    weekday:string
    previsto: TimeHm[]
    realizado:TimeHm[]
    observacao?: string
}

type TimeSheet = {
    dias: Record<string, DayRecord>
}

export function normalize(text:string):string {
    return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .toLowerCase();
}

const dayLineRegex = /^(\d{2}\/\d{2}\/\d{2})\s+([a-z]+)\s+/

function extractDayLines(text:string): string[] {
    return text
    .split('\n')
    .map(l=>l.trim())
    .filter(Boolean)
    .filter(line => dayLineRegex.test(line))
}

function parseTime(t:string): TimeHm {
    const parts = t.split(":")
    if(parts.length !== 2) {
        throw new Error(`invalid Time${t}`)
    }

    const h = Number(parts[0])
    const m = Number(parts[1])
    return {h,m}
}

function parseTimeGroup(group:string):TimeHm[]{
    return group
    .split(/\s+/)
    .filter(Boolean)
    .map(parseTime)
}

const timeGroupRegex = /\(([^)]+)\)/g;

export function normalizeDate(ddmmyy:string):string {
    const [d,m,y] = ddmmyy.split('/')
    return `20${y}-${d}`
}

function parseDayLine(line:string): DayRecord {

    const match = line.match(dayLineRegex);
    if(!match) {
        throw new Error(`Invalid day line, ${line}`)
    }
    const [,rawDate, weekday] = match

    const groups = [...line.matchAll(timeGroupRegex)].map(m=>m[1])

    const previsto = groups[0] ? parseTimeGroup(groups[0]):[]
    const realizado = groups[1] ? parseTimeGroup(groups[1]):[]

    const observacao = line
    .replace(dayLineRegex,"")
    .replace(timeGroupRegex,"")
    .trim()

    return {
        date:normalizeDate(rawDate),
        weekday,
        previsto,
        realizado,
        observacao
    }
}

export function buildTimeSheet(text:string): TimeSheet{
    const dias:Record<string,DayRecord> = {}

    for(const line of extractDayLines(text)) {
        const day = parseDayLine(line)
        dias[day.date] = day
    }

    return {dias}
}


export function extractData(text:string):DadosFuncionario {

    const registroMatch = text.match(/registro\s*:\s*(\d+)/)
    const cartaoMatch = text.match(/cart[ãa]o\s*.\s*(\d+)/)

    const lines = text.split('\n').map(l=>l.trim()).filter(Boolean)



    return {
        nome:
        text.match(/funcionario:\s*([a-z\s]+)/)?.[1]?.trim() ?? "Não encontrado",
        
        identificador:
            registroMatch?.[1] ??
            cartaoMatch?.[1] ??
            "0",

        centroCusto:
        text.match(/centro\s*custo:\s*([a-z\s]+)/)?.[1]?.trim() ?? "Não encontrado",

        cargo:
        text.match(/cargo:\s*([a-z\s]+)/)?.[1]?.trim() ?? "Não encontrado",

        atrasos: "00:00"
    }
}

export async function extrairDadosPonto(caminhoPdf:string) {
    if (!fs.existsSync(caminhoPdf))
    {
        console.error("Arquivo não encontrado");
        return;
    }

    const buffer = fs.readFileSync(caminhoPdf)

    const parser = new PDFParse({data:buffer})
    const result = await parser.getText()

    const text = normalize(result.text)

    const dados = extractData(text)
    
    console.log(dados)

    return dados

    }