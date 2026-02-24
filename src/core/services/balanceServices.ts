import { calculateTimeBank } from "../rules/timeBankRules"
import type { TimeRuleConfig } from "../rules/timeBankRules"
import { loadTimeSheetJson } from "../fileManagement/timeSheetJson"

const defaultRules: TimeRuleConfig = {
  onlyFullExtraHours: true,
  allowCrossDayCompensation: true
}

export async function getJobBalance(jobDir: string) {
  const timesheet = await loadTimeSheetJson(jobDir)

  const result = calculateTimeBank(
    timesheet.days,
    defaultRules
  )

  return result
}