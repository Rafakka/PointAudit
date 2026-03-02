import { PersonalMeta } from "./personal"

export interface TimeHm {
    h:number
    m:number
}

export type TimeEntry = {
  data: string
  horas: string
}

export type TimeSheetData = {
  meta: PersonalMeta
  dias: TimeEntry[]
}