
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