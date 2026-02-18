import { useQuery } from '@tanstack/react-query'
import { UseCustomQueryOptions } from 'types'
import { fetchCoreWithFallback } from './core-fetch'
import { xelvoKeys } from './keys'

export interface XelvoAuditSummary {
  events24h: number
  criticalEvents: number
  lastEventAt?: string
}

function normalizeAuditSummary(payload: unknown): XelvoAuditSummary {
  const source = (payload ?? {}) as {
    events24h?: number
    events?: number
    criticalEvents?: number
    critical?: number
    lastEventAt?: string
    latestEventAt?: string
  }

  return {
    events24h: source.events24h ?? source.events ?? 0,
    criticalEvents: source.criticalEvents ?? source.critical ?? 0,
    lastEventAt: source.lastEventAt ?? source.latestEventAt,
  }
}

export async function getXelvoAuditSummary({
  projectRef,
  signal,
}: {
  projectRef?: string
  signal?: AbortSignal
}): Promise<XelvoAuditSummary> {
  const payload = await fetchCoreWithFallback<unknown>(['v1/audit/summary', 'audit/summary', 'v1/audit'], {
    signal,
    query: { projectRef },
  })

  return normalizeAuditSummary(payload)
}

export type XelvoAuditSummaryData = Awaited<ReturnType<typeof getXelvoAuditSummary>>

export const useXelvoAuditSummaryQuery = <TData = XelvoAuditSummaryData>(
  {
    projectRef,
  }: {
    projectRef?: string
  },
  options: UseCustomQueryOptions<XelvoAuditSummaryData, unknown, TData> = {}
) => {
  return useQuery<XelvoAuditSummaryData, unknown, TData>({
    queryKey: xelvoKeys.auditSummary(projectRef),
    queryFn: ({ signal }) => getXelvoAuditSummary({ projectRef, signal }),
    staleTime: 1000 * 30,
    ...options,
  })
}
