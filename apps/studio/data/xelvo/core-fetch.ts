import { BASE_PATH } from 'lib/constants'

export class XelvoCoreResponseError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

function toQueryString(query?: Record<string, string | number | undefined>) {
  if (!query) return ''
  const params = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined) return
    params.set(key, String(value))
  })

  const serialized = params.toString()
  return serialized.length > 0 ? `?${serialized}` : ''
}

async function fetchCorePath<T>(
  path: string,
  {
    signal,
    query,
  }: {
    signal?: AbortSignal
    query?: Record<string, string | number | undefined>
  } = {}
): Promise<T> {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path
  const response = await fetch(`${BASE_PATH}/api/xelvo/core/${normalizedPath}${toQueryString(query)}`, {
    method: 'GET',
    signal,
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    const body = await response.text()
    throw new XelvoCoreResponseError(
      `Core request failed (${response.status}) for ${normalizedPath}: ${body}`,
      response.status
    )
  }

  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    const text = await response.text()
    return ({ raw: text } as unknown) as T
  }

  return (await response.json()) as T
}

export async function fetchCoreWithFallback<T>(
  paths: string[],
  {
    signal,
    query,
  }: {
    signal?: AbortSignal
    query?: Record<string, string | number | undefined>
  } = {}
): Promise<T> {
  let lastError: unknown

  for (const path of paths) {
    try {
      return await fetchCorePath<T>(path, { signal, query })
    } catch (error) {
      lastError = error
      const status =
        error instanceof XelvoCoreResponseError && typeof error.status === 'number'
          ? error.status
          : 500
      if (status !== 404) throw error
    }
  }

  throw lastError ?? new Error('Core request failed without explicit error')
}
