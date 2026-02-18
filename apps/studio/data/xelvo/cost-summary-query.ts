import { useQuery } from '@tanstack/react-query'
import { UseCustomQueryOptions } from 'types'
import { fetchCoreWithFallback } from './core-fetch'
import { xelvoKeys } from './keys'

export interface XelvoCostSummary {
  dailyCost: number
  monthlyCost: number
  budgetUsagePct: number
  alerts: number
}

function normalizeCostSummary(payload: unknown): XelvoCostSummary {
  const source = (payload ?? {}) as {
    dailyCost?: number
    dayCost?: number
    monthlyCost?: number
    monthCost?: number
    budgetUsagePct?: number
    usagePct?: number
    alerts?: number
    activeAlerts?: unknown[]
  }

  const dailyCost = source.dailyCost ?? source.dayCost ?? 0
  const monthlyCost = source.monthlyCost ?? source.monthCost ?? 0
  const budgetUsagePct = source.budgetUsagePct ?? source.usagePct ?? 0
  const alerts =
    typeof source.alerts === 'number'
      ? source.alerts
      : Array.isArray(source.activeAlerts)
        ? source.activeAlerts.length
        : 0

  return {
    dailyCost,
    monthlyCost,
    budgetUsagePct,
    alerts,
  }
}

export async function getXelvoCostSummary({
  projectRef,
  signal,
}: {
  projectRef?: string
  signal?: AbortSignal
}): Promise<XelvoCostSummary> {
  const payload = await fetchCoreWithFallback<unknown>(['v1/cost/summary', 'cost/summary', 'v1/cost'], {
    signal,
    query: { projectRef },
  })

  return normalizeCostSummary(payload)
}

export type XelvoCostSummaryData = Awaited<ReturnType<typeof getXelvoCostSummary>>

export const useXelvoCostSummaryQuery = <TData = XelvoCostSummaryData>(
  {
    projectRef,
  }: {
    projectRef?: string
  },
  options: UseCustomQueryOptions<XelvoCostSummaryData, unknown, TData> = {}
) => {
  return useQuery<XelvoCostSummaryData, unknown, TData>({
    queryKey: xelvoKeys.costSummary(projectRef),
    queryFn: ({ signal }) => getXelvoCostSummary({ projectRef, signal }),
    staleTime: 1000 * 30,
    ...options,
  })
}
