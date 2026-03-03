import { calculateTimeBank } from "../rules/timeBankRules"
import type { TimeRuleConfig } from "../rules/timeBankRules"
import { loadTimeSheetJson } from "../fileManagement/jobDocumentTools"

const defaultRules: TimeRuleConfig = {
  onlyFullExtraHours: true,
  allowCrossDayCompensation: true
}

export async function getJobBalance(jobDir: string) {
  const {data:timesheet} = await loadTimeSheetJson(jobDir)

  const result = calculateTimeBank(
    timesheet.dias,
    defaultRules
  )

  return result
}