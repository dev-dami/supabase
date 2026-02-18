import { useQuery } from '@tanstack/react-query'
import { UseCustomQueryOptions } from 'types'
import { fetchCoreWithFallback } from './core-fetch'
import { xelvoKeys } from './keys'

type PolicyRecord = { mode?: string; state?: string; violations?: number }

export interface XelvoPoliciesSummary {
  total: number
  enforceMode: number
  violations: number
  items: PolicyRecord[]
}

function normalizePoliciesSummary(payload: unknown): XelvoPoliciesSummary {
  const source: {
    items?: PolicyRecord[]
    total?: number
    enforceMode?: number
    violations?: number
  } = Array.isArray(payload)
    ? { items: payload as PolicyRecord[] }
    : ((payload ?? {}) as {
        items?: PolicyRecord[]
        total?: number
        enforceMode?: number
        violations?: number
      })

  const items = Array.isArray(source?.items) ? source.items : []
  const total = typeof source?.total === 'number' ? source.total : items.length

  const enforceMode =
    typeof source?.enforceMode === 'number'
      ? source.enforceMode
      : items.filter((item) => (item?.mode ?? item?.state ?? '').toLowerCase() === 'enforce').length

  const violations =
    typeof source?.violations === 'number'
      ? source.violations
      : items.reduce((count, item) => count + (item?.violations ?? 0), 0)

  return { total, enforceMode, violations, items }
}

export async function getXelvoPoliciesSummary({
  projectRef,
  signal,
}: {
  projectRef?: string
  signal?: AbortSignal
}): Promise<XelvoPoliciesSummary> {
  const payload = await fetchCoreWithFallback<unknown>(['v1/policies', 'policies'], {
    signal,
    query: { projectRef },
  })
  return normalizePoliciesSummary(payload)
}

export type XelvoPoliciesSummaryData = Awaited<ReturnType<typeof getXelvoPoliciesSummary>>

export const useXelvoPoliciesSummaryQuery = <TData = XelvoPoliciesSummaryData>(
  {
    projectRef,
  }: {
    projectRef?: string
  },
  options: UseCustomQueryOptions<XelvoPoliciesSummaryData, unknown, TData> = {}
) => {
  return useQuery<XelvoPoliciesSummaryData, unknown, TData>({
    queryKey: xelvoKeys.policies(projectRef),
    queryFn: ({ signal }) => getXelvoPoliciesSummary({ projectRef, signal }),
    staleTime: 1000 * 30,
    ...options,
  })
}
