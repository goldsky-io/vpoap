import { createClient, query } from '$lib/client/graphql'
import { fetchJson } from '$lib/client/json'
import type { FetchPOAPTokenData } from '$lib/client/poap'
import type { Fetch } from '$lib/client/types'
import type { POAPEventMetadata } from '$lib/types/poap'
import { POAP_API_KEY } from './env'

// see https://documentation.poap.tech/ for api key
const baseUrl = 'https://api.poap.tech/events/id/'

export function fetchPOAPMetadata(eventId: number, fetch: Fetch) {
  const url = new URL(String(eventId), baseUrl).href
  return fetchJson<POAPEventMetadata>(url, {
    fetch,
    headers: {
      'X-API-Key': POAP_API_KEY,
    },
  })
}

export function fetchPOAPToken(id: number, fetch: Fetch) {
  return createClient(fetch).query<FetchPOAPTokenData>(query.token, { id }).toPromise()
}
