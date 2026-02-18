import { useQuery } from '@tanstack/react-query'
import { UseCustomQueryOptions } from 'types'
import { fetchCoreWithFallback } from './core-fetch'
import { xelvoKeys } from './keys'

type AgentRecord = { status?: string; state?: string }

export interface XelvoAgentsSummary {
  total: number
  running: number
  unhealthy: number
  items: AgentRecord[]
}

function normalizeAgentsSummary(payload: unknown): XelvoAgentsSummary {
  const source: {
    items?: AgentRecord[]
    total?: number
    running?: number
    unhealthy?: number
  } = Array.isArray(payload)
    ? { items: payload as AgentRecord[] }
    : ((payload ?? {}) as {
        items?: AgentRecord[]
        total?: number
        running?: number
        unhealthy?: number
      })

  const items = Array.isArray(source?.items) ? source.items : []
  const total = typeof source?.total === 'number' ? source.total : items.length

  const running =
    typeof source?.running === 'number'
      ? source.running
      : items.filter((item) => {
          const state = (item?.status ?? item?.state ?? '').toLowerCase()
          return ['running', 'active', 'ready'].includes(state)
        }).length

  const unhealthy =
    typeof source?.unhealthy === 'number'
      ? source.unhealthy
      : items.filter((item) => {
          const state = (item?.status ?? item?.state ?? '').toLowerCase()
          return ['error', 'failed', 'degraded', 'unhealthy'].includes(state)
        }).length

  return { total, running, unhealthy, items }
}

export async function getXelvoAgentsSummary({
  projectRef,
  signal,
}: {
  projectRef?: string
  signal?: AbortSignal
}): Promise<XelvoAgentsSummary> {
  const payload = await fetchCoreWithFallback<unknown>(['v1/agents', 'agents'], {
    signal,
    query: { projectRef },
  })
  return normalizeAgentsSummary(payload)
}

export type XelvoAgentsSummaryData = Awaited<ReturnType<typeof getXelvoAgentsSummary>>

export const useXelvoAgentsSummaryQuery = <TData = XelvoAgentsSummaryData>(
  {
    projectRef,
  }: {
    projectRef?: string
  },
  options: UseCustomQueryOptions<XelvoAgentsSummaryData, unknown, TData> = {}
) => {
  return useQuery<XelvoAgentsSummaryData, unknown, TData>({
    queryKey: xelvoKeys.agents(projectRef),
    queryFn: ({ signal }) => getXelvoAgentsSummary({ projectRef, signal }),
    staleTime: 1000 * 30,
    ...options,
  })
}
