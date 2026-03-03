
export interface TimeHm {
    h:number
    m:number
}

export type TimeEntry = {
  data: string
  horas: string
}

export interface DayRecord {
    date:string
    weekday:string
    saldoPositivo?: TimeHm
    saldoNegativo?: TimeHm
    previsto:TimeHm[]
    realizado:TimeHm[]
    atrasos?: TimeHm
    observacao: string
}

export interface TimeSheetData {
    dias: Record<string, DayRecord>
}