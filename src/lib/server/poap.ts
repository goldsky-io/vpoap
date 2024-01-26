import { fetchJson } from '$lib/client/json'
import type { POAPEventMetadata } from '$lib/types/poap'
import { POAP_API_KEY } from './env'

// see https://documentation.poap.tech/ for api key
const baseUrl = 'https://api.poap.tech/events/id/'

export function fetchPOAPMetadata(eventId: number, fetch: typeof window.fetch) {
  const url = new URL(String(eventId), baseUrl).href
  return fetchJson<POAPEventMetadata>(url, {
    fetch,
    headers: {
      'X-API-Key': POAP_API_KEY,
    },
  })
}
