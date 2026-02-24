export type PersonalMeta = {
  nome: string
  userId: string
  source: string
}

export type PersonalData = {
  meta: PersonalMeta
}

export type TimeEntry = {
  data: string
  horas: string
}

export type TimeSheetData = {
  meta: PersonalMeta
  dias: TimeEntry[]
}

export type ExtractedData = {
  personal: PersonalData
  timesheet: TimeSheetData
}

export type Phase =
| "ingested"
| "extracted"
| "confirmed"
| "finalized"
