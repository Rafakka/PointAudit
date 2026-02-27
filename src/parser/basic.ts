
export function normalize(text:string):string {
    return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .toLowerCase();
}

export function normalizeDate(ddmmyy:string):string {
    const [d,m,y] = ddmmyy.split('/')
    return `20${y}-${m}-${d}`
}

export function normalizePairs(
    pairs: {h:number, m:number}[] | undefined, required = 4
) {
    const safe = pairs ?? []
    const filled = [...safe]

    while (filled.length < required) {
        filled.push({h:0, m:0})
    }
    return filled.slice(0,required)
}