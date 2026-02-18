import type { NextApiRequest, NextApiResponse } from 'next'

import apiWrapper from 'lib/api/apiWrapper'

export default (req: NextApiRequest, res: NextApiResponse) =>
  apiWrapper(req, res, handler, { withAuth: true })

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const coreBaseUrl =
    process.env.XELVO_CORE_API_URL || process.env.NEXT_PUBLIC_XELVO_CORE_API_URL || ''

  if (!coreBaseUrl) {
    return res.status(503).json({
      error: {
        message:
          'Xelvo core API is not configured. Set XELVO_CORE_API_URL (or NEXT_PUBLIC_XELVO_CORE_API_URL for local dev).',
      },
    })
  }

  const method = req.method ?? 'GET'
  const pathParam = req.query.path
  const pathSegments = Array.isArray(pathParam) ? pathParam : pathParam ? [pathParam] : []
  const upstreamPath = pathSegments.join('/')

  const baseUrl = coreBaseUrl.endsWith('/') ? coreBaseUrl : `${coreBaseUrl}/`
  const upstreamUrl = new URL(upstreamPath, baseUrl)

  Object.entries(req.query).forEach(([key, value]) => {
    if (key === 'path') return
    if (Array.isArray(value)) {
      value.forEach((entry) => upstreamUrl.searchParams.append(key, entry))
      return
    }
    if (typeof value === 'string') {
      upstreamUrl.searchParams.append(key, value)
    }
  })

  const headers = new Headers()
  headers.set('Accept', 'application/json')

  const incomingContentType = req.headers['content-type']
  if (typeof incomingContentType === 'string') headers.set('Content-Type', incomingContentType)

  const incomingAuthorization = req.headers.authorization
  if (incomingAuthorization) {
    headers.set('Authorization', incomingAuthorization)
  } else if (process.env.XELVO_CORE_API_KEY) {
    headers.set('Authorization', `Bearer ${process.env.XELVO_CORE_API_KEY}`)
  }

  const requestInit: RequestInit = {
    method,
    headers,
  }

  if (!['GET', 'HEAD'].includes(method.toUpperCase()) && req.body !== undefined) {
    requestInit.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
  }

  const response = await fetch(upstreamUrl.toString(), requestInit)
  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')

  if (isJson) {
    const data = await response.json()
    return res.status(response.status).json(data)
  }

  const text = await response.text()
  if (contentType) res.setHeader('Content-Type', contentType)
  return res.status(response.status).send(text)
}
