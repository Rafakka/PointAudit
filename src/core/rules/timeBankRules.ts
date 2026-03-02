import { BalancedResult } from "../../../contracts/balance"
import { DayRecord } from "../fileManagement/types"

export type TimeRuleConfig = {
  onlyFullExtraHours: boolean
  allowCrossDayCompensation: boolean
}

export const defaultTimeRules: TimeRuleConfig = {
  onlyFullExtraHours: true,
  allowCrossDayCompensation: true
}

function toMinutes(t: { h: number; m: number }) {
  return t.h * 60 + t.m
}

function sumTimes(times: { h: number; m: number }[]) {
  return times.reduce((acc, t) => acc + toMinutes(t), 0)
}

function formatMinutes(totalMinutes: number) {
  const sign = totalMinutes < 0 ? "-" : ""
  const abs = Math.abs(totalMinutes)

  const h = Math.floor(abs / 60)
  const m = abs % 60

  return `${sign}${h.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}`
}

export function calculateTimeBank(
  days: Record<string, DayRecord>,
  config: TimeRuleConfig
): BalancedResult {

  const orderedDays = Object.values(days).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  let runningBalance = 0
  let totalWorked = 0
  let totalRequired = 0

  for (const day of orderedDays) {

    const previstoTotal = sumTimes(day.previsto)
    const realizadoTotal = sumTimes(day.realizado)

    totalWorked += realizadoTotal
    totalRequired += previstoTotal

    let diff = realizadoTotal - previstoTotal

    // Rule C: only full positive hours count
    if (config.onlyFullExtraHours && diff > 0) {
      diff = Math.floor(diff / 60) * 60
    }

    if (config.allowCrossDayCompensation) {
      runningBalance += diff
    } else {
      // If not allowing cross-day compensation,
      // only count positive full hours
      if (diff > 0) {
        runningBalance += diff
      }
    }
  }

  return {
    totalWorkingMinutes: totalWorked,
    totalRequiredMinutes: totalRequired,
    balancedMinutes: runningBalance,
    formattedBalance: formatMinutes(runningBalance)
  }
}