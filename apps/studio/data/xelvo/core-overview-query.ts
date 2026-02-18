import { useQuery } from '@tanstack/react-query'
import { BASE_PATH } from 'lib/constants'
import { UseCustomQueryOptions } from 'types'
import { xelvoKeys } from './keys'

export interface XelvoCoreOverview {
  connected: boolean
  health: string
  userId?: string
  userEmail?: string
  hasApiKeyContext: boolean
}

export async function getXelvoCoreOverview(signal?: AbortSignal): Promise<XelvoCoreOverview> {
  const [healthResult, meResult] = await Promise.allSettled([
    fetch(`${BASE_PATH}/api/xelvo/core/healthz`, {
      method: 'GET',
      signal,
    }),
    fetch(`${BASE_PATH}/api/xelvo/core/v1/me`, {
      method: 'GET',
      signal,
      headers: { 'Content-Type': 'application/json' },
    }),
  ])

  let health = 'unknown'
  let connected = false
  let userId: string | undefined
  let userEmail: string | undefined
  let hasApiKeyContext = false

  if (healthResult.status === 'fulfilled') {
    const text = (await healthResult.value.text()).trim().toLowerCase()
    health = text || `http_${healthResult.value.status}`
    connected = healthResult.value.ok && (text === 'ok' || text === 'ready')
  }

  if (meResult.status === 'fulfilled') {
    if (meResult.value.ok) {
      const me = await meResult.value.json()
      userId = typeof me?.id === 'string' ? me.id : undefined
      userEmail = typeof me?.email === 'string' ? me.email : undefined
      hasApiKeyContext = Boolean(userId)
    } else {
      hasApiKeyContext = meResult.value.status !== 401
    }
  }

  return {
    connected,
    health,
    userId,
    userEmail,
    hasApiKeyContext,
  }
}

export const useXelvoCoreOverviewQuery = <TData = XelvoCoreOverview>(
  options: UseCustomQueryOptions<XelvoCoreOverview, unknown, TData> = {}
) => {
  return useQuery<XelvoCoreOverview, unknown, TData>({
    queryKey: xelvoKeys.coreOverview(),
    queryFn: ({ signal }) => getXelvoCoreOverview(signal),
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 45,
    ...options,
  })
}
