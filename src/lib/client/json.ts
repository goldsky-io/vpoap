import type { Fetch } from './types'

export interface FetchOptions extends RequestInit {
  fetch?: Fetch
  debug?: boolean
}

export async function fetchJson<T = unknown>(
  path: string,
  { fetch = window.fetch, debug, ...options }: FetchOptions = {},
): Promise<T> {
  if (debug) console.log('fetchJson', path)
  const response = await fetch(path, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const body = await response.text()
    const json = tryParseJson(body)

    if (json && typeof json === 'object' && 'message' in json && typeof json.message === 'string') {
      throw new Error(json.message)
    }

    console.error(body || 'unexpected error')
    throw new Error(`unable to fetch: ${path}`)
  }

  return response.json() as Promise<T>

  function tryParseJson(text: string): unknown {
    try {
      return JSON.parse(text)
    } catch {
      // do nothing
    }
  }
}
