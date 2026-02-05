import { normalize, normalizeDate } from "./basic"

interface TimeHm {
    h:number
    m:number
}

interface DayRecord {
    date:string
    weekday:string
    saldoPositivo?: TimeHm
    previsto:TimeHm[]
    realizado:TimeHm[]
    faltas?: TimeHm
    atrasos?: TimeHm
    observacao: string
}

type TimeSheet = {
    dias: Record<string, DayRecord>
}

const dayLineRegex = /^(\d{2}\/\d{2}\/\d{2})\s+([a-z]+)\s+/
const timeGroupRegex = /\(([^)]+)\)/g;
const traillingTimeRegex = /\b\d{2}:\d{2}\b/g

function matchDayHeader(line:string) {
    const match = line.match(dayLineRegex)
    if (!match) return null;

    const weekdayRaw = match[2]
    if (!weekdayRaw) throw new Error('Missing weekday')
    
    const weekday = normalize(weekdayRaw)

    return {
        rawDate:match[1],
        weekday:weekday,
        rest: line.replace(dayLineRegex,"").trim()
    };
}


function extractTimeGroups(text:string): string[]{
    return [...text.matchAll(timeGroupRegex)]
    .map(m=> m[1])
    .filter((g): g is string => Boolean(g))
}

function parseTimeGroup(group:string): TimeHm[]{
    return group
    .split(/\s+/)
    .filter(Boolean)
    .map(parseTime)
}

function parsePrevistoRealizado(groups:string[]) {
    return {
        previsto:groups[0] ? parseTimeGroup(groups[0]):[],
        realizado:groups[1] ? parseTimeGroup(groups[1]):[]
    };
}

function parseTail(tail:string): {
    saldoPositivo?:TimeHm
    faltas?:TimeHm
    atrasos?:TimeHm
    observacao:string
}{
    const times = [...tail.matchAll(traillingTimeRegex)].map(m=>m[0])

    const result: {
        saldoPositivo?: TimeHm
        faltas?: TimeHm
        atrasos?: TimeHm
        observacao:string
    } = {
        observacao:tail
        .replace(traillingTimeRegex, "")
        .replace(/\s+/g,"")
        .trim()
    }

    if(times[0]) result.saldoPositivo = parseTime(times[0])
    if(times[1]) result.faltas = parseTime(times[1])
    if(times[2]) result.atrasos = parseTime(times[2])
    
    return result
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

function extractDayLines(text:string): string[] {
    return text
    .split('\n')
    .map(l=>l.trim())
    .filter(Boolean)
    .filter(line => dayLineRegex.test(line))
}

export function buildTimeSheet(text:string): TimeSheet{
    const dias:Record<string,DayRecord> = {}

    const dayLines = extractDayLines(text)

    for(const line of dayLines) {
        const record = parseDayLine(line)
        dias[record.date] = record
    }

    return {dias}
}

function parseDayLine(line:string): DayRecord {

    const header = matchDayHeader(line);
    if(!header) {
        throw new Error(`Invalid day line, ${line}`)
    }
    
    const { rawDate, weekday, rest} = header
    if(!rawDate || !weekday || !rest) {
        throw new Error(`Invalid day line, ${line}`)
    }

    const timeGroups = extractTimeGroups(rest);

    const { previsto, realizado} = parsePrevistoRealizado(timeGroups)

    const tail = rest.replace(timeGroupRegex,"").trim()

    const {
        saldoPositivo,
        faltas,
        atrasos,
        observacao,
    } = parseTail(tail)

    const record: DayRecord = {
        date:normalizeDate(rawDate),
        weekday,
        previsto,
        realizado,
        observacao
    }

    if (saldoPositivo) record.saldoPositivo = saldoPositivo
    if (faltas) record.faltas = faltas
    if (atrasos) record.atrasos = atrasos

    return record

}